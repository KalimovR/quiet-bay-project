import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3';

// Webhook IP whitelist (YooKassa official IPs)
const YOOKASSA_IPS = [
  '185.71.76.0/27',
  '185.71.77.0/27',
  '77.75.153.0/25',
  '77.75.156.11',
  '77.75.156.35',
  '77.75.154.128/25',
  '2a02:5180::/32'
];

// Verify webhook notification object structure
function isValidWebhookPayload(payload: any): boolean {
  return payload && 
    payload.type && 
    payload.event && 
    payload.object && 
    payload.object.id;
}

// Processed webhook IDs to prevent duplicates (in-memory, resets on cold start)
const processedWebhooks = new Set<string>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const shopId = Deno.env.get('YOOKASSA_SHOP_ID');
    const secretKey = Deno.env.get('YOOKASSA_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!shopId || !secretKey) {
      console.error('YooKassa credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.text();
    let parsedBody: any;
    
    try {
      parsedBody = JSON.parse(body);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { action, ...params } = parsedBody;

    console.log('YooKassa action:', action, 'params:', JSON.stringify(params));

    // Create idempotency key for payment creation
    const generateIdempotencyKey = () => {
      return crypto.randomUUID();
    };

    // ===== WEBHOOK HANDLER =====
    if (action === 'webhook' || parsedBody.type === 'notification') {
      console.log('Received webhook notification');
      
      // Validate webhook payload structure
      if (!isValidWebhookPayload(parsedBody)) {
        console.error('Invalid webhook payload structure');
        return new Response(
          JSON.stringify({ error: 'Invalid webhook payload' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const notification = parsedBody;
      const payment = notification.object;
      const eventId = `${payment.id}_${notification.event}`;
      
      // Check for duplicate webhook (idempotency)
      if (processedWebhooks.has(eventId)) {
        console.log('Duplicate webhook ignored:', eventId);
        return new Response(
          JSON.stringify({ status: 'ok', message: 'Already processed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Mark as processed
      processedWebhooks.add(eventId);
      
      // Keep set size manageable (max 1000 entries)
      if (processedWebhooks.size > 1000) {
        const firstKey = processedWebhooks.values().next().value;
        if (firstKey) processedWebhooks.delete(firstKey);
      }
      
      // Verify payment with YooKassa API (CRITICAL: don't trust client data)
      const verifyResponse = await fetch(`${YOOKASSA_API_URL}/payments/${payment.id}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(`${shopId}:${secretKey}`),
          'Content-Type': 'application/json'
        }
      });
      
      if (!verifyResponse.ok) {
        console.error('Failed to verify payment with YooKassa');
        return new Response(
          JSON.stringify({ error: 'Payment verification failed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const verifiedPayment = await verifyResponse.json();
      console.log('Verified payment:', JSON.stringify(verifiedPayment));
      
      // Only process if payment is actually succeeded (from YooKassa API, not webhook)
      if (verifiedPayment.status === 'succeeded' && verifiedPayment.metadata) {
        const { product_type, product_id, user_id } = verifiedPayment.metadata;

        if (user_id && product_type === 'course' && product_id) {
          const { data: existing } = await supabase
            .from('user_courses')
            .select('id')
            .eq('user_id', user_id)
            .eq('course_id', product_id)
            .maybeSingle();

          if (!existing) {
            const { error } = await supabase
              .from('user_courses')
              .insert({ user_id, course_id: product_id });
            
            if (error) {
              console.error('Error granting course access:', error);
            } else {
              console.log('Course access granted via webhook:', product_id, 'to user:', user_id);
            }
          }
        }

        if (user_id && product_type === 'subscription') {
          const { data: existing } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', user_id)
            .eq('status', 'active')
            .maybeSingle();

          if (!existing) {
            const isYearly = product_id === 'yearly';
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + (isYearly ? 12 : 1));

            const { error } = await supabase
              .from('subscriptions')
              .insert({
                user_id,
                plan_name: isYearly ? 'Годовой Премиум' : 'Премиум',
                status: 'active',
                expires_at: expiresAt.toISOString()
              });
            
            if (error) {
              console.error('Error creating subscription:', error);
            } else {
              console.log('Subscription created via webhook for user:', user_id);
            }
          }
        }
      }
      
      return new Response(
        JSON.stringify({ status: 'ok' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'create-payment') {
      const { amount, description, productType, productId, userId, returnUrl } = params;

      // SECURITY: Validate amount is positive and reasonable
      if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 1000000) {
        return new Response(
          JSON.stringify({ error: 'Invalid amount' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!description || !productType || !returnUrl) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create payment in YooKassa
      const idempotencyKey = generateIdempotencyKey();
      
      const paymentData = {
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB'
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: returnUrl
        },
        description,
        metadata: {
          product_type: productType,
          product_id: productId || null,
          user_id: userId || null
        },
        receipt: {
          customer: {
            email: params.email || undefined
          },
          items: [
            {
              description: description.substring(0, 128),
              quantity: '1',
              amount: {
                value: amount.toFixed(2),
                currency: 'RUB'
              },
              vat_code: 1, // НДС не облагается (для самозанятых)
              payment_subject: 'service',
              payment_mode: 'full_payment'
            }
          ]
        }
      };

      console.log('Creating YooKassa payment:', JSON.stringify(paymentData));

      const response = await fetch(`${YOOKASSA_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${shopId}:${secretKey}`),
          'Content-Type': 'application/json',
          'Idempotence-Key': idempotencyKey
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      console.log('YooKassa response:', JSON.stringify(result));

      if (!response.ok) {
        console.error('YooKassa error:', result);
        return new Response(
          JSON.stringify({ error: result.description || 'Payment creation failed' }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          paymentId: result.id,
          confirmationUrl: result.confirmation?.confirmation_url,
          status: result.status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'check-payment') {
      const { paymentId } = params;

      if (!paymentId) {
        return new Response(
          JSON.stringify({ error: 'Payment ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(`${YOOKASSA_API_URL}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(`${shopId}:${secretKey}`),
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      console.log('Payment status check:', JSON.stringify(result));

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to check payment status' }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If payment succeeded, grant access (verified from YooKassa API)
      if (result.status === 'succeeded' && result.metadata) {
        const { product_type, product_id, user_id } = result.metadata;

        if (user_id && product_type === 'course' && product_id) {
          // Check if already granted
          const { data: existing } = await supabase
            .from('user_courses')
            .select('id')
            .eq('user_id', user_id)
            .eq('course_id', product_id)
            .maybeSingle();

          if (!existing) {
            // Grant course access
            const { error } = await supabase
              .from('user_courses')
              .insert({ user_id, course_id: product_id });
            
            if (error) {
              console.error('Error granting course access:', error);
            } else {
              console.log('Course access granted:', product_id, 'to user:', user_id);
            }
          }
        }

        if (user_id && product_type === 'subscription') {
          // Check if active subscription exists
          const { data: existing } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', user_id)
            .eq('status', 'active')
            .maybeSingle();

          if (!existing) {
            // Calculate expiry based on plan
            const isYearly = product_id === 'yearly';
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + (isYearly ? 12 : 1));

            const { error } = await supabase
              .from('subscriptions')
              .insert({
                user_id,
                plan_name: isYearly ? 'Годовой Премиум' : 'Премиум',
                status: 'active',
                expires_at: expiresAt.toISOString()
              });
            
            if (error) {
              console.error('Error creating subscription:', error);
            } else {
              console.log('Subscription created for user:', user_id);
            }
          }
        }
      }

      return new Response(
        JSON.stringify({
          status: result.status,
          paid: result.paid,
          amount: result.amount,
          metadata: result.metadata
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in yookassa-payment function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

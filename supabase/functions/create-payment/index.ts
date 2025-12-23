import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  type: 'course' | 'subscription';
  itemId?: string;
  plan?: string;
  amount: number;
  description: string;
  returnUrl: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const shopId = Deno.env.get('YOKASSA_SHOP_ID');
    const secretKey = Deno.env.get('YOKASSA_SECRET_KEY');
    
    if (!shopId || !secretKey) {
      console.error('YooKassa credentials not configured');
      throw new Error('Payment system not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Требуется авторизация для оплаты' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { type, itemId, plan, amount, description, returnUrl }: PaymentRequest = await req.json();

    console.log('Creating payment:', { type, itemId, plan, amount, userId });

    const idempotencyKey = crypto.randomUUID();

    const metadata: Record<string, string> = {
      user_id: userId,
      type: type,
    };

    if (type === 'course' && itemId) {
      metadata.course_id = itemId;
    } else if (type === 'subscription' && plan) {
      metadata.plan = plan;
    }

    // Create payment in YooKassa
    const paymentResponse = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${shopId}:${secretKey}`),
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotencyKey,
      },
      body: JSON.stringify({
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB',
        },
        confirmation: {
          type: 'redirect',
          return_url: returnUrl,
        },
        capture: true,
        description: description,
        metadata: metadata,
      }),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('YooKassa API error:', errorText);
      throw new Error('Ошибка создания платежа');
    }

    const paymentData = await paymentResponse.json();
    console.log('Payment created:', paymentData.id, 'Status:', paymentData.status);

    // Сохраняем платёж в базу для отслеживания
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        payment_id: paymentData.id,
        user_id: userId,
        type: type,
        item_id: type === 'course' ? itemId : plan,
        amount: amount,
        status: 'pending',
        metadata: metadata,
      });

    if (insertError) {
      console.error('Error saving payment:', insertError);
      // Не прерываем - платёж создан в ЮKassa
    }

    return new Response(
      JSON.stringify({
        paymentId: paymentData.id,
        confirmationUrl: paymentData.confirmation.confirmation_url,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error creating payment:', error);
    const message = error instanceof Error ? error.message : 'Ошибка создания платежа';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

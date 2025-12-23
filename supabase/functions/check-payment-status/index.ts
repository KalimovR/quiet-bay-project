import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const paymentId = url.searchParams.get('payment_id');

    // Если передан payment_id, проверяем конкретный платёж
    if (paymentId) {
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_id', paymentId)
        .eq('user_id', userId)
        .single();

      if (paymentError || !payment) {
        return new Response(
          JSON.stringify({ 
            status: 'not_found',
            message: 'Платёж не найден'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Если платёж ещё pending, проверяем статус в ЮKassa
      if (payment.status === 'pending') {
        const shopId = Deno.env.get('YOKASSA_SHOP_ID');
        const secretKey = Deno.env.get('YOKASSA_SECRET_KEY');
        
        if (shopId && secretKey) {
          try {
            const yokassaResponse = await fetch(
              `https://api.yookassa.ru/v3/payments/${paymentId}`,
              {
                headers: {
                  'Authorization': 'Basic ' + btoa(`${shopId}:${secretKey}`),
                },
              }
            );

            if (yokassaResponse.ok) {
              const yokassaPayment = await yokassaResponse.json();
              console.log('YooKassa payment status:', yokassaPayment.status);

              if (yokassaPayment.status === 'succeeded' && payment.status !== 'succeeded') {
                // Платёж успешен, но webhook ещё не обработан - обрабатываем сейчас
                await supabase
                  .from('payments')
                  .update({ status: 'succeeded' })
                  .eq('payment_id', paymentId);

                // Активируем покупку
                const metadata = yokassaPayment.metadata;
                const type = metadata?.type;

                if (type === 'course') {
                  // Даём доступ ко всем курсам
                  const { data: allCourses } = await supabase
                    .from('courses')
                    .select('id');
                  
                  if (allCourses) {
                    for (const course of allCourses) {
                      await supabase
                        .from('course_purchases')
                        .upsert({
                          user_id: userId,
                          course_id: course.id,
                        }, {
                          onConflict: 'user_id,course_id'
                        });
                    }
                  }
                  console.log('Courses activated for user:', userId);
                } else if (type === 'subscription') {
                  const plan = metadata?.plan || 'premium';
                  let durationMonths = 1;
                  if (plan === 'yearly') durationMonths = 12;

                  await supabase
                    .from('subscriptions')
                    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
                    .eq('user_id', userId)
                    .eq('status', 'active');

                  const expiresAt = new Date();
                  expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

                  await supabase
                    .from('subscriptions')
                    .insert({
                      user_id: userId,
                      plan: plan,
                      status: 'active',
                      expires_at: expiresAt.toISOString(),
                      activated_at: new Date().toISOString(),
                    });
                  
                  console.log('Subscription activated for user:', userId);
                }

                return new Response(
                  JSON.stringify({ 
                    status: 'succeeded',
                    type: type,
                    message: type === 'course' ? 'Курс активирован!' : 'Подписка активирована!'
                  }),
                  { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
              } else if (yokassaPayment.status === 'canceled') {
                await supabase
                  .from('payments')
                  .update({ status: 'cancelled' })
                  .eq('payment_id', paymentId);

                return new Response(
                  JSON.stringify({ 
                    status: 'cancelled',
                    message: 'Платёж отменён'
                  }),
                  { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
              }
            }
          } catch (e) {
            console.error('Error checking YooKassa status:', e);
          }
        }
      }

      return new Response(
        JSON.stringify({ 
          status: payment.status,
          type: payment.type,
          message: payment.status === 'succeeded' 
            ? (payment.type === 'course' ? 'Курс активирован!' : 'Подписка активирована!')
            : 'Ожидаем подтверждение оплаты...'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Если payment_id не передан, возвращаем последние платежи
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (paymentsError) {
      throw paymentsError;
    }

    // Также проверяем наличие подписки и курсов
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status, expires_at')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: purchases } = await supabase
      .from('course_purchases')
      .select('course_id')
      .eq('user_id', userId);

    return new Response(
      JSON.stringify({
        payments: payments || [],
        hasActiveSubscription: !!subscription,
        subscription: subscription,
        hasPurchasedCourses: (purchases?.length || 0) > 0,
        purchasedCoursesCount: purchases?.length || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error checking payment status:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

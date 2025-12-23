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

    const body = await req.json();
    console.log('Webhook received:', JSON.stringify(body));

    const event = body.event;
    const payment = body.object;

    // Обновляем статус платежа в базе
    const paymentId = payment.id;
    let newStatus = 'pending';
    
    if (event === 'payment.succeeded') {
      newStatus = 'succeeded';
    } else if (event === 'payment.canceled') {
      newStatus = 'cancelled';
    } else if (event === 'payment.waiting_for_capture') {
      newStatus = 'pending';
    } else {
      console.log('Unknown event:', event);
    }

    // Обновляем статус платежа
    const { error: updateError } = await supabase
      .from('payments')
      .update({ status: newStatus })
      .eq('payment_id', paymentId);

    if (updateError) {
      console.error('Error updating payment status:', updateError);
    }

    if (event !== 'payment.succeeded') {
      console.log('Payment not succeeded, status:', event);
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const metadata = payment.metadata;
    const userId = metadata?.user_id;
    const type = metadata?.type;

    if (!userId || !type) {
      console.error('Missing metadata:', metadata);
      return new Response(JSON.stringify({ error: 'Invalid metadata' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing successful payment:', { userId, type, paymentId });

    if (type === 'course') {
      const courseId = metadata.course_id;
      if (!courseId) {
        console.error('Missing course_id in metadata');
        // Попробуем найти первый курс
        const { data: courses } = await supabase
          .from('courses')
          .select('id')
          .order('lesson_number', { ascending: true })
          .limit(1);
        
        if (courses && courses.length > 0) {
          const firstCourseId = courses[0].id;
          
          // Записываем покупку для всех курсов (полный доступ)
          const { data: allCourses } = await supabase
            .from('courses')
            .select('id');
          
          if (allCourses) {
            for (const course of allCourses) {
              const { error: insertError } = await supabase
                .from('course_purchases')
                .upsert({
                  user_id: userId,
                  course_id: course.id,
                }, {
                  onConflict: 'user_id,course_id'
                });
              
              if (insertError) {
                console.error('Error inserting course purchase:', insertError);
              }
            }
          }
          console.log('All courses unlocked for user:', userId);
        }
      } else {
        // Записываем покупку конкретного курса
        const { error: insertError } = await supabase
          .from('course_purchases')
          .upsert({
            user_id: userId,
            course_id: courseId,
          }, {
            onConflict: 'user_id,course_id'
          });

        if (insertError) {
          console.error('Error inserting course purchase:', insertError);
        } else {
          console.log('Course purchase recorded:', { userId, courseId });
        }
      }

    } else if (type === 'subscription') {
      const plan = metadata.plan;
      if (!plan) {
        console.error('Missing plan in metadata');
        return new Response(JSON.stringify({ error: 'Missing plan' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Определяем длительность подписки
      let durationMonths = 1;
      if (plan === 'yearly') {
        durationMonths = 12;
      } else if (plan === 'lifetime') {
        durationMonths = 1200;
      }

      // Отменяем существующие активные подписки
      const { error: cancelError } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (cancelError) {
        console.error('Error cancelling old subscriptions:', cancelError);
      }

      // Создаём новую подписку
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan: plan,
          status: 'active',
          expires_at: expiresAt.toISOString(),
          activated_at: new Date().toISOString(),
        });

      if (subError) {
        console.error('Error creating subscription:', subError);
      } else {
        console.log('Subscription created:', { userId, plan, expiresAt });
      }
    }

    console.log('Payment processed successfully:', paymentId);

    return new Response(JSON.stringify({ received: true, processed: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

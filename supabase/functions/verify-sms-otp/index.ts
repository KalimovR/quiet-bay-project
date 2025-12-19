import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, code, action, password, name } = await req.json();
    
    if (!phone || !code) {
      console.error('Phone and code are required');
      return new Response(
        JSON.stringify({ error: 'Номер телефона и код обязательны' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!password && action === 'signup') {
      console.error('Password is required for signup');
      return new Response(
        JSON.stringify({ error: 'Пароль обязателен' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
    console.log(`Verifying OTP for phone: ${normalizedPhone}, code: ${code}, action: ${action}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check OTP code
    const { data: otpData, error: otpError } = await supabase
      .from('phone_otp_codes')
      .select('*')
      .eq('phone', normalizedPhone)
      .eq('code', code)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) {
      console.error('Error fetching OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Ошибка проверки кода' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!otpData) {
      console.log('Invalid or expired OTP');
      return new Response(
        JSON.stringify({ error: 'Неверный или истёкший код' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark OTP as used
    await supabase
      .from('phone_otp_codes')
      .update({ used: true })
      .eq('id', otpData.id);

    console.log('OTP verified successfully');

    const fakeEmail = `${normalizedPhone.replace('+', '')}@phone.local`;

    // Handle signup action (only action that requires OTP)
    if (action === 'signup') {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => 
        u.phone === normalizedPhone || 
        u.email === fakeEmail ||
        u.user_metadata?.phone === normalizedPhone
      );

      if (existingUser) {
        console.log('User already exists');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Этот номер уже зарегистрирован',
            needsLogin: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create new user with the password provided by the user
      const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
        email: fakeEmail,
        password: password,
        email_confirm: true,
        phone: normalizedPhone,
        phone_confirm: true,
        user_metadata: { name: name || '', phone: normalizedPhone }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        return new Response(
          JSON.stringify({ error: signUpError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('User created successfully:', authData.user.id);

      // Return email for client-side login (password is already known to client)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Регистрация успешна',
          email: fakeEmail,
          userId: authData.user.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'change_phone') {
      // For phone change in settings, just verify and return success
      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: true,
          message: 'Телефон подтверждён' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, verified: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-sms-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Внутренняя ошибка сервера' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

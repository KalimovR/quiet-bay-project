import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Test mode: set to true to use test code 123456 instead of sending real SMS
const TEST_MODE = false;
const TEST_CODE = "123456";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, action } = await req.json();
    
    if (!phone) {
      console.error('Phone number is required');
      return new Response(
        JSON.stringify({ error: 'Номер телефона обязателен' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize phone number (remove spaces, dashes, etc.)
    const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
    console.log(`Processing SMS OTP request for phone: ${normalizedPhone}, action: ${action}`);

    // Generate 6-digit OTP code (or use test code)
    const otpCode = TEST_MODE ? TEST_CODE : Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP code for ${normalizedPhone}${TEST_MODE ? ' (TEST MODE - code: 123456)' : ''}`);

    // Store OTP in database first
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Delete old OTP codes for this phone
    await supabase
      .from('phone_otp_codes')
      .delete()
      .eq('phone', normalizedPhone);

    // Insert new OTP code
    const { error: insertError } = await supabase
      .from('phone_otp_codes')
      .insert({
        phone: normalizedPhone,
        code: otpCode,
      });

    if (insertError) {
      console.error('Failed to store OTP:', insertError);
      return new Response(
        JSON.stringify({ error: 'Ошибка сохранения кода' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In test mode, skip actual SMS sending
    if (TEST_MODE) {
      console.log(`TEST MODE: SMS would be sent to ${normalizedPhone} with code ${TEST_CODE}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Тестовый режим: используйте код 123456',
          testMode: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get SMSC credentials
    const smscLogin = Deno.env.get('SMSC_LOGIN');
    const smscPassword = Deno.env.get('SMSC_PASSWORD');

    if (!smscLogin || !smscPassword) {
      console.error('SMSC credentials not configured');
      return new Response(
        JSON.stringify({ error: 'SMS сервис не настроен' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send SMS via SMSC.ru API
    const message = `Ваш код подтверждения: ${otpCode}`;
    const smscUrl = new URL('https://smsc.ru/sys/send.php');
    smscUrl.searchParams.set('login', smscLogin);
    smscUrl.searchParams.set('psw', smscPassword);
    smscUrl.searchParams.set('phones', normalizedPhone);
    smscUrl.searchParams.set('mes', message);
    smscUrl.searchParams.set('fmt', '3'); // JSON response
    smscUrl.searchParams.set('charset', 'utf-8');

    console.log(`Sending SMS to ${normalizedPhone} via SMSC.ru`);
    
    const smscResponse = await fetch(smscUrl.toString());
    const smscResult = await smscResponse.json();
    
    console.log('SMSC response:', JSON.stringify(smscResult));

    if (smscResult.error) {
      console.error(`SMSC error: ${smscResult.error} (code: ${smscResult.error_code})`);
      return new Response(
        JSON.stringify({ error: `Ошибка отправки SMS: ${smscResult.error}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`SMS sent successfully to ${normalizedPhone}, cost: ${smscResult.cost}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Код отправлен на ваш телефон' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-sms-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Внутренняя ошибка сервера' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

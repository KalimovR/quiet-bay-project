import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_FREE_MINUTES = 35;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ipAddress, action, minutesToAdd } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];

    if (action === 'check') {
      // Check current usage
      const { data: usage, error } = await supabase
        .from('daily_usage')
        .select('minutes_used')
        .eq('ip_address', ipAddress)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking usage:', error);
        throw error;
      }

      const minutesUsed = usage?.minutes_used || 0;
      const remainingMinutes = Math.max(0, DAILY_FREE_MINUTES - minutesUsed);
      const isLimitReached = remainingMinutes <= 0;

      return new Response(JSON.stringify({
        minutesUsed,
        remainingMinutes,
        isLimitReached,
        dailyLimit: DAILY_FREE_MINUTES,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update') {
      // Update usage - add minutes
      const { data: existing } = await supabase
        .from('daily_usage')
        .select('id, minutes_used')
        .eq('ip_address', ipAddress)
        .eq('date', today)
        .single();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('daily_usage')
          .update({ minutes_used: existing.minutes_used + (minutesToAdd || 1) })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('daily_usage')
          .insert({
            ip_address: ipAddress,
            date: today,
            minutes_used: minutesToAdd || 1,
          });

        if (error) throw error;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Usage tracking error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

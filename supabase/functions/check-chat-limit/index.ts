import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FREE_DAILY_LIMIT_SECONDS = 35 * 60; // 35 minutes

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, secondsToAdd } = await req.json();
    
    // Get client IP from headers
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
    
    console.log("Check chat limit for IP:", ip, "Action:", action);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date().toISOString().split("T")[0];

    if (action === "check") {
      // Check current usage for this IP
      const { data, error } = await supabase
        .from("anonymous_chat_usage")
        .select("seconds_used")
        .eq("ip_address", ip)
        .eq("usage_date", today)
        .maybeSingle();

      if (error) {
        console.error("Error checking usage:", error);
        throw error;
      }

      const secondsUsed = data?.seconds_used || 0;
      const isLimitReached = secondsUsed >= FREE_DAILY_LIMIT_SECONDS;
      const remainingSeconds = Math.max(0, FREE_DAILY_LIMIT_SECONDS - secondsUsed);

      return new Response(
        JSON.stringify({ 
          secondsUsed, 
          isLimitReached, 
          remainingSeconds,
          limitSeconds: FREE_DAILY_LIMIT_SECONDS 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "update" && typeof secondsToAdd === "number") {
      // Update usage for this IP
      const { data: existing } = await supabase
        .from("anonymous_chat_usage")
        .select("id, seconds_used")
        .eq("ip_address", ip)
        .eq("usage_date", today)
        .maybeSingle();

      let newTotal: number;

      if (existing) {
        newTotal = existing.seconds_used + secondsToAdd;
        await supabase
          .from("anonymous_chat_usage")
          .update({ seconds_used: newTotal })
          .eq("id", existing.id);
      } else {
        newTotal = secondsToAdd;
        await supabase
          .from("anonymous_chat_usage")
          .insert({ ip_address: ip, usage_date: today, seconds_used: secondsToAdd });
      }

      const isLimitReached = newTotal >= FREE_DAILY_LIMIT_SECONDS;

      return new Response(
        JSON.stringify({ 
          secondsUsed: newTotal, 
          isLimitReached,
          remainingSeconds: Math.max(0, FREE_DAILY_LIMIT_SECONDS - newTotal)
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("check-chat-limit error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

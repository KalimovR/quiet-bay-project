// Public function: delete a chat conversation + its messages for a given ipAddress
// Uses service role key server-side.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type DeleteConversationBody = {
  conversationId?: string;
  ipAddress?: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as DeleteConversationBody;
    const conversationId = body.conversationId;
    const ipAddress = body.ipAddress;

    if (!conversationId || !ipAddress) {
      return new Response(
        JSON.stringify({ error: "conversationId and ipAddress are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    console.log("Deleting conversation", { conversationId, ipAddress });

    const { data: conv, error: convErr } = await supabaseAdmin
      .from("chat_conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("ip_address", ipAddress)
      .maybeSingle();

    if (convErr) {
      console.error("Error checking conversation ownership", convErr);
      return new Response(JSON.stringify({ error: "Failed to check conversation" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!conv) {
      return new Response(JSON.stringify({ error: "Conversation not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: msgErr } = await supabaseAdmin
      .from("chat_messages")
      .delete()
      .eq("conversation_id", conversationId);

    if (msgErr) {
      console.error("Error deleting messages", msgErr);
      return new Response(JSON.stringify({ error: "Failed to delete messages" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: delErr } = await supabaseAdmin
      .from("chat_conversations")
      .delete()
      .eq("id", conversationId)
      .eq("ip_address", ipAddress);

    if (delErr) {
      console.error("Error deleting conversation", delErr);
      return new Response(JSON.stringify({ error: "Failed to delete conversation" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Deleted conversation successfully", { conversationId });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unexpected error", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

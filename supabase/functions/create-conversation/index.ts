import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ipAddress, userId } = await req.json();

    if (!ipAddress) {
      return new Response(
        JSON.stringify({ error: "IP address is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create the conversation
    const { data: conversation, error: convError } = await supabase
      .from("chat_conversations")
      .insert({
        ip_address: ipAddress,
        title: "Новый разговор",
        user_id: userId || null,
      })
      .select()
      .single();

    if (convError) {
      console.error("Error creating conversation:", convError);
      return new Response(
        JSON.stringify({ error: "Failed to create conversation" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create welcome message
    const welcomeMessage = "Я здесь.\nЗдесь можно быть любым и не подбирать слова.\nМы никуда не спешим.";
    
    const { data: welcomeData, error: msgError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversation.id,
        role: "assistant",
        content: welcomeMessage,
      })
      .select()
      .single();

    if (msgError) {
      console.error("Error creating welcome message:", msgError);
    }

    return new Response(
      JSON.stringify({
        conversation,
        welcomeMessage: {
          id: welcomeData?.id || "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date().toISOString(),
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in create-conversation:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

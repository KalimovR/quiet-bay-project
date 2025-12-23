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
    const { conversationId, ipAddress, userId } = await req.json();

    if (!conversationId) {
      return new Response(JSON.stringify({ error: 'conversationId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get conversation messages
    const { data: messages, error: msgError } = await supabase
      .from('chat_messages')
      .select('role, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (msgError || !messages || messages.length < 2) {
      return new Response(JSON.stringify({ error: 'Not enough messages for summary' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare conversation text for AI (limited to last 20 messages for cost control)
    const recentMessages = messages.slice(-20);
    const conversationText = recentMessages
      .map(m => `${m.role === 'user' ? 'Пользователь' : 'Алёна'}: ${m.content}`)
      .join('\n\n');

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // Generate summary using AI
    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://quietbay.app',
        'X-Title': 'Quiet Bay',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `Ты — аналитик психологических сессий. Твоя задача — создать краткое саммари диалога.

Ответь СТРОГО в формате JSON:
{
  "emotional_state": "одно слово или фраза: тревога, грусть, пустота, усталость, злость, смешанное, нейтральное",
  "summary": "1-2 предложения о главном в сессии",
  "key_themes": ["тема1", "тема2", "тема3"]
}

Правила:
- summary должен быть на русском
- key_themes — максимум 5 тем
- Не добавляй ничего кроме JSON
- Не используй личные данные в summary`
          },
          {
            role: 'user',
            content: `Проанализируй этот диалог:\n\n${conversationText}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI summary error:', errorText);
      throw new Error('Failed to generate summary');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';

    // Parse AI response
    let summaryData;
    try {
      // Clean up response in case of markdown code blocks
      const cleanedContent = aiContent.replace(/```json\n?|\n?```/g, '').trim();
      summaryData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI summary:', aiContent);
      summaryData = {
        emotional_state: 'неопределено',
        summary: 'Не удалось создать саммари.',
        key_themes: []
      };
    }

    // Calculate session duration (approximate)
    const firstMsgTime = new Date(messages[0].created_at).getTime();
    const lastMsgTime = new Date(messages[messages.length - 1].created_at).getTime();
    const durationMinutes = Math.round((lastMsgTime - firstMsgTime) / 60000);

    // Save or update summary
    const { data: existingSummary } = await supabase
      .from('session_summaries')
      .select('id')
      .eq('conversation_id', conversationId)
      .maybeSingle();

    const summaryRecord = {
      conversation_id: conversationId,
      user_identifier: ipAddress || 'unknown',
      user_id: userId || null,
      emotional_state: summaryData.emotional_state,
      summary: summaryData.summary,
      key_themes: summaryData.key_themes || [],
      message_count: messages.length,
      duration_minutes: durationMinutes > 0 ? durationMinutes : null,
    };

    let savedSummary;
    if (existingSummary) {
      const { data, error } = await supabase
        .from('session_summaries')
        .update(summaryRecord)
        .eq('id', existingSummary.id)
        .select()
        .single();
      if (error) throw error;
      savedSummary = data;
    } else {
      const { data, error } = await supabase
        .from('session_summaries')
        .insert(summaryRecord)
        .select()
        .single();
      if (error) throw error;
      savedSummary = data;
    }

    console.log(`Summary generated for conversation ${conversationId}`);

    return new Response(JSON.stringify({ success: true, summary: savedSummary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Summary generation error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

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

    if (!conversationId || !ipAddress) {
      return new Response(JSON.stringify({ error: 'conversationId and ipAddress required' }), {
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
      .select('role, content')
      .eq('conversation_id', conversationId)
      .eq('role', 'user')
      .order('created_at', { ascending: true });

    if (msgError || !messages || messages.length < 3) {
      return new Response(JSON.stringify({ error: 'Not enough user messages for memory extraction' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get existing memories to avoid duplicates
    const { data: existingMemories } = await supabase
      .from('user_memory')
      .select('content')
      .eq('user_identifier', ipAddress);

    const existingContents = new Set((existingMemories || []).map(m => m.content.toLowerCase()));

    // Prepare user messages for AI
    const userMessages = messages.map(m => m.content).join('\n---\n');

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // Extract key facts using AI
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
            content: `Ты — аналитик, извлекающий ключевые факты о пользователе из его сообщений.

Ответь СТРОГО в формате JSON:
{
  "memories": [
    {
      "type": "fact|theme|preference|state",
      "content": "краткий факт на русском, 1-2 предложения",
      "importance": 1-10
    }
  ]
}

Типы памяти:
- fact: конкретный факт о жизни (работа, отношения, события)
- theme: повторяющаяся тема (одиночество, тревога о будущем)
- preference: как человек предпочитает общаться
- state: текущее эмоциональное состояние

Правила:
- Максимум 5 записей
- Не храни личные данные (имена, адреса, телефоны)
- importance: 10 = критически важно, 1 = просто интересно
- Только то, что ЯВНО сказано, не домысливай`
          },
          {
            role: 'user',
            content: `Извлеки ключевые факты из этих сообщений пользователя:\n\n${userMessages}`
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI memory extraction error:', errorText);
      throw new Error('Failed to extract memories');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';

    // Parse AI response
    let memoryData;
    try {
      const cleanedContent = aiContent.replace(/```json\n?|\n?```/g, '').trim();
      memoryData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI memory:', aiContent);
      return new Response(JSON.stringify({ error: 'Failed to parse memory extraction' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Filter out duplicates and save new memories
    const newMemories = [];
    for (const memory of (memoryData.memories || [])) {
      const contentLower = memory.content.toLowerCase();
      
      // Skip if similar memory exists
      if (existingContents.has(contentLower)) continue;
      
      // Check for similar content (rough match)
      let isDuplicate = false;
      for (const existing of existingContents) {
        if (contentLower.includes(existing) || existing.includes(contentLower)) {
          isDuplicate = true;
          break;
        }
      }
      if (isDuplicate) continue;

      const { data, error } = await supabase
        .from('user_memory')
        .insert({
          user_identifier: ipAddress,
          user_id: userId || null,
          memory_type: memory.type || 'fact',
          content: memory.content,
          importance: Math.min(10, Math.max(1, memory.importance || 5)),
        })
        .select()
        .single();

      if (!error && data) {
        newMemories.push(data);
        existingContents.add(contentLower);
      }
    }

    console.log(`Extracted ${newMemories.length} new memories for ${ipAddress}`);

    return new Response(JSON.stringify({ 
      success: true, 
      extracted: newMemories.length,
      memories: newMemories 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Memory extraction error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

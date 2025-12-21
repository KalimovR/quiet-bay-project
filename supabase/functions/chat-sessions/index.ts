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
    const { action, sessionId, userId, title, role, content, replaceOldest } = await req.json();
    
    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Chat sessions action:", action, "IP:", clientIP);

    // Get subscription for limits
    let subscription = null;
    if (userId) {
      const { data } = await supabase
        .from('subscriptions')
        .select('plan_name, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      subscription = data;
    }

    const getSessionLimit = () => {
      if (!subscription) return 3;
      if (subscription.plan_name === 'yearly') return 999999;
      return 7;
    };

    switch (action) {
      case 'list': {
        let query = supabase
          .from('chat_sessions')
          .select('id, title, created_at, updated_at')
          .order('updated_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        } else {
          // For anonymous users, only show sessions without user_id
          query = query.eq('ip_address', clientIP).is('user_id', null);
        }

        const limit = getSessionLimit();
        if (limit < 999999) {
          query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({ sessions: data || [], limit }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create': {
        // Check limit - for authenticated users count by user_id, for anonymous count by IP where user_id is null
        let countQuery = supabase
          .from('chat_sessions')
          .select('id, created_at')
          .order('created_at', { ascending: true });

        if (userId) {
          countQuery = countQuery.eq('user_id', userId);
        } else {
          countQuery = countQuery.eq('ip_address', clientIP).is('user_id', null);
        }

        const { data: existingSessions, error: countError } = await countQuery;
        if (countError) throw countError;

        const count = existingSessions?.length || 0;
        const limit = getSessionLimit();

        if (count >= limit) {
          if (replaceOldest && existingSessions && existingSessions.length > 0) {
            // Delete oldest session (first in ascending order)
            const oldest = existingSessions[0];
            console.log("Replacing oldest session:", oldest.id);

            // Delete messages first
            const { error: msgErr } = await supabase
              .from('chat_messages')
              .delete()
              .eq('session_id', oldest.id);
            if (msgErr) throw msgErr;

            // Delete session
            const { error: sessErr } = await supabase
              .from('chat_sessions')
              .delete()
              .eq('id', oldest.id);
            if (sessErr) throw sessErr;
          } else {
            return new Response(JSON.stringify({ 
              error: 'limit_exceeded',
              message: limit === 3 
                ? 'Бесплатный аккаунт позволяет хранить до 3 чатов.'
                : 'Премиум аккаунт позволяет хранить до 7 чатов.'
            }), {
              status: 403,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }

        const sessionData: any = {
          title: title || 'Новый чат',
          ip_address: clientIP,
        };
        if (userId) {
          sessionData.user_id = userId;
        }

        const { data, error } = await supabase
          .from('chat_sessions')
          .insert(sessionData)
          .select('id, title, created_at, updated_at')
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ session: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        if (!sessionId) throw new Error('sessionId required');

        // Verify ownership
        const { data: session, error: sessionError } = await supabase
          .from('chat_sessions')
          .select('user_id, ip_address')
          .eq('id', sessionId)
          .single();

        if (sessionError) throw sessionError;

        if (!session) {
          return new Response(JSON.stringify({ error: 'Session not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const canDelete = (userId && session.user_id === userId) ||
          (!userId && session.user_id === null && session.ip_address === clientIP);

        if (!canDelete) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Delete messages first to avoid FK constraint errors
        const { error: msgDeleteError } = await supabase
          .from('chat_messages')
          .delete()
          .eq('session_id', sessionId);
        if (msgDeleteError) throw msgDeleteError;

        const { error: sessDeleteError } = await supabase
          .from('chat_sessions')
          .delete()
          .eq('id', sessionId);
        if (sessDeleteError) throw sessDeleteError;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_messages': {
        if (!sessionId) throw new Error('sessionId required');

        const { data, error } = await supabase
          .from('chat_messages')
          .select('id, session_id, role, content, created_at')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        return new Response(JSON.stringify({ messages: data || [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'add_message': {
        if (!sessionId || !role || !content) {
          throw new Error('sessionId, role, content required');
        }

        const { data, error } = await supabase
          .from('chat_messages')
          .insert({ session_id: sessionId, role, content })
          .select('id, session_id, role, content, created_at')
          .single();

        if (error) throw error;

        // Update session title if first user message
        if (role === 'user') {
          const { count } = await supabase
            .from('chat_messages')
            .select('id', { count: 'exact', head: true })
            .eq('session_id', sessionId)
            .eq('role', 'user');

          if (count === 1) {
            const newTitle = content.slice(0, 50) + (content.length > 50 ? '...' : '');
            await supabase
              .from('chat_sessions')
              .update({ title: newTitle })
              .eq('id', sessionId);
          }
        }

        return new Response(JSON.stringify({ message: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error("Chat sessions error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

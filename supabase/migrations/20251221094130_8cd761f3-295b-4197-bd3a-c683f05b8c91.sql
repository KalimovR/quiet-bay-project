-- SECURITY FIX: Lock down chat tables (no direct client access)

-- Remove FK to auth.users (avoid referencing Supabase-managed auth schema)
ALTER TABLE public.chat_sessions
  DROP CONSTRAINT IF EXISTS chat_sessions_user_id_fkey;

-- Drop all existing policies on chat tables
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can view own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can update own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can delete own chat sessions" ON public.chat_sessions;

DROP POLICY IF EXISTS "Users can view messages in their sessions" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert messages in their sessions" ON public.chat_messages;

DROP POLICY IF EXISTS "Service role can manage chat usage" ON public.chat_usage;

-- Keep RLS enabled; with no policies, tables are not accessible from the client.
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_usage ENABLE ROW LEVEL SECURITY;
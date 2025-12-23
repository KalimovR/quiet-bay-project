-- Drop existing restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can update their conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can view their conversations by IP" ON public.chat_conversations;

-- Create permissive policies for chat_conversations
CREATE POLICY "Anyone can create conversations" 
ON public.chat_conversations 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view conversations" 
ON public.chat_conversations 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Anyone can update conversations" 
ON public.chat_conversations 
FOR UPDATE 
TO public
USING (true);

CREATE POLICY "Anyone can delete conversations" 
ON public.chat_conversations 
FOR DELETE 
TO public
USING (true);

-- Fix chat_messages policies too
DROP POLICY IF EXISTS "Anyone can create messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can view messages" ON public.chat_messages;

CREATE POLICY "Anyone can create messages" 
ON public.chat_messages 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view messages" 
ON public.chat_messages 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Anyone can delete messages" 
ON public.chat_messages 
FOR DELETE 
TO public
USING (true);
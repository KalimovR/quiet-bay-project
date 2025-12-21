-- Drop old policy
DROP POLICY IF EXISTS "Users can create chat sessions" ON public.chat_sessions;

-- Create more permissive policy for anonymous users
CREATE POLICY "Anyone can create chat sessions" 
ON public.chat_sessions 
FOR INSERT 
WITH CHECK (true);

-- Update view policy to be more permissive
DROP POLICY IF EXISTS "Users can view own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can view own chat sessions" 
ON public.chat_sessions 
FOR SELECT 
USING (true);
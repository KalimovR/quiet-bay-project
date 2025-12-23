-- Add user_id column to chat_conversations
ALTER TABLE public.chat_conversations 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);

-- Create function to migrate conversations from IP to user
CREATE OR REPLACE FUNCTION public.migrate_ip_conversations_to_user(
  _user_id uuid,
  _ip_address text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  migrated_count integer;
BEGIN
  UPDATE public.chat_conversations
  SET user_id = _user_id
  WHERE ip_address = _ip_address
    AND user_id IS NULL;
  
  GET DIAGNOSTICS migrated_count = ROW_COUNT;
  RETURN migrated_count;
END;
$$;

-- Update RLS policies to include user_id checks
DROP POLICY IF EXISTS "Anyone can view conversations" ON public.chat_conversations;
CREATE POLICY "Users can view own conversations"
ON public.chat_conversations
FOR SELECT
USING (
  ip_address = (current_setting('request.headers', true)::json->>'x-forwarded-for')
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Anyone can update conversations" ON public.chat_conversations;
CREATE POLICY "Users can update own conversations"
ON public.chat_conversations
FOR UPDATE
USING (
  ip_address = (current_setting('request.headers', true)::json->>'x-forwarded-for')
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Anyone can delete conversations" ON public.chat_conversations;
CREATE POLICY "Users can delete own conversations"
ON public.chat_conversations
FOR DELETE
USING (
  ip_address = (current_setting('request.headers', true)::json->>'x-forwarded-for')
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);
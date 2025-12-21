-- Таблица для хранения чат-сессий
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  title TEXT DEFAULT 'Новый чат',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица для сообщений чата
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица для трекинга времени использования по IP
CREATE TABLE public.chat_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  minutes_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ip_address, date)
);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_usage ENABLE ROW LEVEL SECURITY;

-- RLS для chat_sessions: пользователи видят свои чаты или анонимные по IP
CREATE POLICY "Users can view own chat sessions" 
ON public.chat_sessions 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND ip_address IS NOT NULL)
);

CREATE POLICY "Users can create chat sessions" 
ON public.chat_sessions 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND user_id IS NULL)
);

CREATE POLICY "Users can update own chat sessions" 
ON public.chat_sessions 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND ip_address IS NOT NULL)
);

CREATE POLICY "Users can delete own chat sessions" 
ON public.chat_sessions 
FOR DELETE 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND ip_address IS NOT NULL)
);

-- RLS для chat_messages через session
CREATE POLICY "Users can view messages in their sessions" 
ON public.chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE id = chat_messages.session_id 
    AND ((auth.uid() IS NOT NULL AND auth.uid() = user_id) OR (auth.uid() IS NULL AND ip_address IS NOT NULL))
  )
);

CREATE POLICY "Users can insert messages in their sessions" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE id = chat_messages.session_id 
    AND ((auth.uid() IS NOT NULL AND auth.uid() = user_id) OR (auth.uid() IS NULL AND ip_address IS NOT NULL))
  )
);

-- RLS для chat_usage: edge function работает с service role
CREATE POLICY "Service role can manage chat usage" 
ON public.chat_usage 
FOR ALL 
USING (true);

-- Trigger для обновления updated_at
CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_usage_updated_at
BEFORE UPDATE ON public.chat_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
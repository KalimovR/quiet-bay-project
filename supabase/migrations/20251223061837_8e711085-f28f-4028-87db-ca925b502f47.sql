-- Таблица для долгосрочной памяти пользователя
CREATE TABLE public.user_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier TEXT NOT NULL, -- IP или user_id
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL DEFAULT 'fact', -- fact, theme, preference, state
  content TEXT NOT NULL,
  importance INTEGER DEFAULT 5 CHECK (importance BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL = никогда
  UNIQUE(user_identifier, content)
);

-- Таблица для истории сессий с саммари
CREATE TABLE public.session_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emotional_state TEXT, -- основное состояние сессии
  summary TEXT NOT NULL, -- 1-2 предложения
  key_themes TEXT[], -- массив тем
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INTEGER DEFAULT 0,
  duration_minutes INTEGER, -- примерная длительность
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(conversation_id)
);

-- Таблица для трекинга кризисных событий (для безопасности и аналитики)
CREATE TABLE public.crisis_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE SET NULL,
  user_identifier TEXT NOT NULL,
  crisis_type TEXT NOT NULL, -- suicidal, self_harm, severe_distress
  severity INTEGER DEFAULT 5 CHECK (severity BETWEEN 1 AND 10),
  detected_keywords TEXT[],
  response_given TEXT, -- что ответил бот
  resources_shown BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_events ENABLE ROW LEVEL SECURITY;

-- Политики для user_memory
CREATE POLICY "Users can view own memory"
ON public.user_memory FOR SELECT
USING (
  user_identifier = (current_setting('request.headers'::text, true)::json->>'x-forwarded-for')
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

CREATE POLICY "Service can insert memory"
ON public.user_memory FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service can update memory"
ON public.user_memory FOR UPDATE
USING (true);

CREATE POLICY "Users can delete own memory"
ON public.user_memory FOR DELETE
USING (
  user_identifier = (current_setting('request.headers'::text, true)::json->>'x-forwarded-for')
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

CREATE POLICY "Admins can view all memory"
ON public.user_memory FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Политики для session_summaries
CREATE POLICY "Users can view own summaries"
ON public.session_summaries FOR SELECT
USING (
  user_identifier = (current_setting('request.headers'::text, true)::json->>'x-forwarded-for')
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

CREATE POLICY "Service can insert summaries"
ON public.session_summaries FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service can update summaries"
ON public.session_summaries FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all summaries"
ON public.session_summaries FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Политики для crisis_events (только админы + сервис)
CREATE POLICY "Admins can view crisis events"
ON public.crisis_events FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service can insert crisis events"
ON public.crisis_events FOR INSERT
WITH CHECK (true);

-- Триггер для обновления updated_at
CREATE TRIGGER update_user_memory_updated_at
BEFORE UPDATE ON public.user_memory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Индексы для производительности
CREATE INDEX idx_user_memory_identifier ON public.user_memory(user_identifier);
CREATE INDEX idx_user_memory_user_id ON public.user_memory(user_id);
CREATE INDEX idx_session_summaries_user ON public.session_summaries(user_identifier);
CREATE INDEX idx_session_summaries_date ON public.session_summaries(session_date DESC);
CREATE INDEX idx_crisis_events_created ON public.crisis_events(created_at DESC);
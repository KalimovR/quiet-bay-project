-- Таблица User Interaction Profile для адаптивного профилирования
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  
  -- Динамические черты (0-100)
  traits JSONB NOT NULL DEFAULT '{
    "anxiety": 50,
    "avoidance": 50,
    "need_for_validation": 50,
    "need_for_structure": 50,
    "emotional_expressiveness": 50,
    "trust_level": 50
  }'::jsonb,
  
  -- Доминирующие паттерны с весами
  dominant_patterns JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Статистика взаимодействия
  total_messages INTEGER NOT NULL DEFAULT 0,
  total_conversations INTEGER NOT NULL DEFAULT 0,
  avg_message_length NUMERIC DEFAULT 0,
  
  -- История снимков профиля для отслеживания динамики
  history_snapshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Мета-информация
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_updated_at ON public.user_profiles(updated_at);

-- RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть и обновлять только свой профиль
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Сервис может создавать и обновлять профили
CREATE POLICY "Service can insert profiles" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service can update profiles" 
ON public.user_profiles 
FOR UPDATE 
USING (true);

-- Админы могут видеть все профили
CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Триггер для обновления updated_at
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Таблица сигналов сообщений для аналитики
CREATE TABLE public.message_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id UUID,
  
  -- Сигналы сообщения
  emotional_valence NUMERIC NOT NULL DEFAULT 0, -- -1 до +1
  emotional_intensity NUMERIC NOT NULL DEFAULT 0, -- 0 до 1
  verbosity TEXT NOT NULL DEFAULT 'medium', -- short, medium, long
  cognitive_style TEXT NOT NULL DEFAULT 'mixed', -- emotional, mixed, rational
  initiative TEXT NOT NULL DEFAULT 'balanced', -- passive, balanced, dominant
  
  -- Дополнительные метрики
  word_count INTEGER NOT NULL DEFAULT 0,
  question_count INTEGER NOT NULL DEFAULT 0,
  exclamation_count INTEGER NOT NULL DEFAULT 0,
  
  -- Detected topics/themes
  detected_themes TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Индексы
CREATE INDEX idx_message_signals_message_id ON public.message_signals(message_id);
CREATE INDEX idx_message_signals_conversation_id ON public.message_signals(conversation_id);
CREATE INDEX idx_message_signals_user_id ON public.message_signals(user_id);
CREATE INDEX idx_message_signals_created_at ON public.message_signals(created_at);

-- RLS
ALTER TABLE public.message_signals ENABLE ROW LEVEL SECURITY;

-- Сервис может всё
CREATE POLICY "Service can insert signals" 
ON public.message_signals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service can select signals" 
ON public.message_signals 
FOR SELECT 
USING (true);

-- Админы могут видеть все сигналы
CREATE POLICY "Admins can view all signals" 
ON public.message_signals 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));
-- Create table for chat conversations
CREATE TABLE public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL,
    title TEXT DEFAULT 'Новый разговор',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for chat messages
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for daily usage tracking by IP
CREATE TABLE public.daily_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    minutes_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(ip_address, date)
);

-- Enable RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_conversations (public access by IP - no auth required)
CREATE POLICY "Anyone can create conversations" 
ON public.chat_conversations 
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can view their conversations by IP" 
ON public.chat_conversations 
FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Anyone can update their conversations" 
ON public.chat_conversations 
FOR UPDATE 
TO anon
USING (true);

-- RLS policies for chat_messages
CREATE POLICY "Anyone can create messages" 
ON public.chat_messages 
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can view messages" 
ON public.chat_messages 
FOR SELECT 
TO anon
USING (true);

-- RLS policies for daily_usage
CREATE POLICY "Anyone can view usage" 
ON public.daily_usage 
FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Anyone can insert usage" 
ON public.daily_usage 
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can update usage" 
ON public.daily_usage 
FOR UPDATE 
TO anon
USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_chat_conversations_updated_at
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_usage_updated_at
    BEFORE UPDATE ON public.daily_usage
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
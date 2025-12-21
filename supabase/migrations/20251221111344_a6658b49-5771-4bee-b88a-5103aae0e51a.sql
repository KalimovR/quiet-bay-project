-- Create table for chat feedback/reviews
CREATE TABLE public.chat_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id UUID REFERENCES public.chat_sessions(id),
  rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 10),
  message TEXT,
  photo_url TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;

-- Users can create their own feedback
CREATE POLICY "Users can create feedback"
ON public.chat_feedback
FOR INSERT
WITH CHECK (true);

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
ON public.chat_feedback
FOR SELECT
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND ip_address = current_setting('request.headers', true)::json->>'x-forwarded-for')
);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
ON public.chat_feedback
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create table for spam logs
CREATE TABLE public.spam_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  user_id UUID,
  spam_type TEXT NOT NULL,
  message_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for spam logs
ALTER TABLE public.spam_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view spam logs
CREATE POLICY "Admins can view spam logs"
ON public.spam_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Edge functions can insert spam logs
CREATE POLICY "Allow insert spam logs"
ON public.spam_logs
FOR INSERT
WITH CHECK (true);

-- Create storage bucket for feedback photos
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('feedback-photos', 'feedback-photos', true, 10485760);

-- Storage policies for feedback photos
CREATE POLICY "Anyone can upload feedback photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'feedback-photos');

CREATE POLICY "Anyone can view feedback photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'feedback-photos');
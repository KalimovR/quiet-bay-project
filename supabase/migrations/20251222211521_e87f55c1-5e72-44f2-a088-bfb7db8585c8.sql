-- Create reviews/feedback table
CREATE TABLE public.chat_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  message TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can create reviews
CREATE POLICY "Anyone can create reviews"
ON public.chat_reviews
FOR INSERT
WITH CHECK (true);

-- Users can view own reviews
CREATE POLICY "Users can view own reviews"
ON public.chat_reviews
FOR SELECT
USING (
  ip_address = current_setting('request.headers', true)::json->>'x-forwarded-for'
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- Admins can view all reviews
CREATE POLICY "Admins can view all reviews"
ON public.chat_reviews
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.chat_reviews
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('review-images', 'review-images', true, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for review images
CREATE POLICY "Anyone can upload review images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'review-images');

CREATE POLICY "Anyone can view review images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'review-images');

-- Create spam_logs table for tracking spam attempts
CREATE TABLE public.spam_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  reason TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spam_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view spam logs
CREATE POLICY "Admins can view spam logs"
ON public.spam_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can insert spam logs (from edge function)
CREATE POLICY "Anyone can insert spam logs"
ON public.spam_logs
FOR INSERT
WITH CHECK (true);
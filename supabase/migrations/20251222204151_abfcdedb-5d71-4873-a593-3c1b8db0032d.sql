-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create security definer function to get user email by id
CREATE OR REPLACE FUNCTION public.get_user_email(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = _user_id
$$;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create user_activity table for tracking online users
CREATE TABLE public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('online', 'watching_course', 'chatting')),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE (user_id)
);

-- Enable RLS on user_activity
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert/update their own activity
CREATE POLICY "Users can manage own activity"
ON public.user_activity
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all activity
CREATE POLICY "Admins can view all activity"
ON public.user_activity
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update chat_conversations to allow admins to view all
CREATE POLICY "Admins can view all conversations"
ON public.chat_conversations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update chat_messages to allow admins to view all
CREATE POLICY "Admins can view all messages"
ON public.chat_messages
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to get all profiles for admin
CREATE OR REPLACE FUNCTION public.get_all_profiles_for_admin()
RETURNS TABLE (
  id UUID,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    u.email,
    p.display_name,
    p.avatar_url,
    p.created_at
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id;
END;
$$;

-- Create function to grant course to user (admin only)
CREATE OR REPLACE FUNCTION public.admin_grant_course(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  INSERT INTO public.course_purchases (user_id, course_id)
  VALUES (_user_id, _course_id)
  ON CONFLICT (user_id, course_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- Add unique constraint for course_purchases if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'course_purchases_user_course_unique'
  ) THEN
    ALTER TABLE public.course_purchases ADD CONSTRAINT course_purchases_user_course_unique UNIQUE (user_id, course_id);
  END IF;
END$$;

-- Create function to grant subscription to user (admin only)
CREATE OR REPLACE FUNCTION public.admin_grant_subscription(_user_id UUID, _plan TEXT, _months INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Deactivate existing subscriptions
  UPDATE public.subscriptions 
  SET status = 'cancelled', cancelled_at = now()
  WHERE user_id = _user_id AND status = 'active';
  
  -- Create new subscription
  INSERT INTO public.subscriptions (user_id, plan, status, expires_at)
  VALUES (_user_id, _plan, 'active', now() + (_months || ' months')::interval);
  
  RETURN TRUE;
END;
$$;

-- Allow admins to insert subscriptions
CREATE POLICY "Admins can insert subscriptions"
ON public.subscriptions
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update subscriptions  
CREATE POLICY "Admins can update subscriptions"
ON public.subscriptions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for user_activity
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_activity;
-- Fix the get_all_profiles_for_admin function to match column types
DROP FUNCTION IF EXISTS public.get_all_profiles_for_admin();

CREATE OR REPLACE FUNCTION public.get_all_profiles_for_admin()
RETURNS TABLE(id uuid, email character varying(255), display_name text, avatar_url text, created_at timestamp with time zone)
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

-- Update admin_grant_subscription to support hours
DROP FUNCTION IF EXISTS public.admin_grant_subscription(uuid, text, integer);

CREATE OR REPLACE FUNCTION public.admin_grant_subscription(_user_id uuid, _plan text, _duration_value integer, _duration_unit text DEFAULT 'months')
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _interval interval;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Calculate interval based on unit
  CASE _duration_unit
    WHEN 'hours' THEN _interval := (_duration_value || ' hours')::interval;
    WHEN 'days' THEN _interval := (_duration_value || ' days')::interval;
    WHEN 'weeks' THEN _interval := (_duration_value || ' weeks')::interval;
    WHEN 'months' THEN _interval := (_duration_value || ' months')::interval;
    WHEN 'years' THEN _interval := (_duration_value || ' years')::interval;
    ELSE _interval := (_duration_value || ' months')::interval;
  END CASE;
  
  -- Deactivate existing subscriptions
  UPDATE public.subscriptions 
  SET status = 'cancelled', cancelled_at = now()
  WHERE user_id = _user_id AND status = 'active';
  
  -- Create new subscription
  INSERT INTO public.subscriptions (user_id, plan, status, expires_at)
  VALUES (_user_id, _plan, 'active', now() + _interval);
  
  RETURN TRUE;
END;
$$;
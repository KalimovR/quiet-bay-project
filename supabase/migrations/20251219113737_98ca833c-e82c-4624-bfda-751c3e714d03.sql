-- Create gifts table to track gifts given by admin
CREATE TABLE public.gifts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    gift_type text NOT NULL CHECK (gift_type IN ('premium', 'annual', 'course')),
    duration_days integer, -- null for permanent/course
    expires_at timestamp with time zone,
    message text,
    read boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by uuid NOT NULL
);

-- Enable RLS
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Users can view their own gifts
CREATE POLICY "Users can view their own gifts"
ON public.gifts
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own gifts (mark as read)
CREATE POLICY "Users can update their own gifts"
ON public.gifts
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can insert gifts
CREATE POLICY "Admins can insert gifts"
ON public.gifts
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can view all gifts
CREATE POLICY "Admins can view all gifts"
ON public.gifts
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for gifts table
ALTER PUBLICATION supabase_realtime ADD TABLE public.gifts;

-- Function to apply gift (create subscription or course purchase)
CREATE OR REPLACE FUNCTION public.apply_gift(
    _gift_id uuid,
    _user_id uuid,
    _gift_type text,
    _duration_days integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _expires_at timestamptz;
BEGIN
    -- Check if caller is admin
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;

    IF _gift_type = 'course' THEN
        -- Add course purchase
        INSERT INTO course_purchases (user_id, course_id)
        VALUES (_user_id, 'meditation-course')
        ON CONFLICT DO NOTHING;
    ELSE
        -- Calculate expiration
        IF _duration_days IS NOT NULL AND _duration_days > 0 THEN
            _expires_at := now() + (_duration_days || ' days')::interval;
        ELSE
            _expires_at := NULL; -- permanent
        END IF;

        -- Add or update subscription
        INSERT INTO user_subscriptions (user_id, tier, starts_at, expires_at)
        VALUES (_user_id, _gift_type::subscription_tier, now(), _expires_at)
        ON CONFLICT (user_id) DO UPDATE SET
            tier = _gift_type::subscription_tier,
            starts_at = now(),
            expires_at = _expires_at,
            updated_at = now();
    END IF;

    -- Update gift with expiration
    UPDATE gifts SET expires_at = _expires_at WHERE id = _gift_id;
END;
$$;

-- Add unique constraint for user_subscriptions if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'user_subscriptions_user_id_key'
    ) THEN
        ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);
    END IF;
END $$;
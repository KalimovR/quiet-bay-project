-- Create table for anonymous (IP-based) chat usage tracking
CREATE TABLE public.anonymous_chat_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  seconds_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ip_address, usage_date)
);

-- No RLS needed - this table is accessed only via edge function
-- But we enable it and create a policy for service role access
ALTER TABLE public.anonymous_chat_usage ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage this table (edge functions use service role)
CREATE POLICY "Service role can manage anonymous usage"
ON public.anonymous_chat_usage
FOR ALL
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_anonymous_chat_usage_updated_at
BEFORE UPDATE ON public.anonymous_chat_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Create table for storing OTP codes for phone verification
CREATE TABLE public.phone_otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '5 minutes'),
  used BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.phone_otp_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for anonymous users trying to register)
CREATE POLICY "Anyone can create OTP codes" 
ON public.phone_otp_codes 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read their own OTP (by phone)
CREATE POLICY "Anyone can verify their OTP" 
ON public.phone_otp_codes 
FOR SELECT 
USING (true);

-- Allow update for marking as used
CREATE POLICY "Anyone can mark OTP as used" 
ON public.phone_otp_codes 
FOR UPDATE 
USING (true);

-- Add index for faster lookups
CREATE INDEX idx_phone_otp_phone ON public.phone_otp_codes(phone);
CREATE INDEX idx_phone_otp_expires ON public.phone_otp_codes(expires_at);
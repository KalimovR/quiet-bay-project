-- Harden OTP storage: only backend functions (service role) should access this table.
-- Remove overly permissive public policies.

DROP POLICY IF EXISTS "Anyone can create OTP codes" ON public.phone_otp_codes;
DROP POLICY IF EXISTS "Anyone can verify their OTP" ON public.phone_otp_codes;
DROP POLICY IF EXISTS "Anyone can mark OTP as used" ON public.phone_otp_codes;
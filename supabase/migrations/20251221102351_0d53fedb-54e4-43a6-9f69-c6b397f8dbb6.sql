-- Add unique constraint on user_id for user_presence to enable upsert
ALTER TABLE public.user_presence ADD CONSTRAINT user_presence_user_id_unique UNIQUE (user_id);
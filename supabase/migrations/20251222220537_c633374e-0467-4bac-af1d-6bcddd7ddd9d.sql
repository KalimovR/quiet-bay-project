-- Add column to store video position in seconds
ALTER TABLE public.course_progress 
ADD COLUMN IF NOT EXISTS last_video_seconds integer DEFAULT 0;
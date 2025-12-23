-- Add video_url column to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Update courses with video URLs
UPDATE public.courses SET video_url = '/videos/urok-1.mp4' WHERE lesson_number = 1;
UPDATE public.courses SET video_url = '/videos/urok-2.mp4' WHERE lesson_number = 2;
UPDATE public.courses SET video_url = '/videos/urok-3.mp4' WHERE lesson_number = 3;
UPDATE public.courses SET video_url = '/videos/urok-4.mp4' WHERE lesson_number = 4;
UPDATE public.courses SET video_url = '/videos/urok-5.mp4' WHERE lesson_number = 5;
UPDATE public.courses SET video_url = '/videos/urok-6.mp4' WHERE lesson_number = 6;
UPDATE public.courses SET video_url = '/videos/urok-7.mp4' WHERE lesson_number = 7;
UPDATE public.courses SET video_url = '/videos/urok-8.mp4' WHERE lesson_number = 8;
UPDATE public.courses SET video_url = '/videos/urok-9.mp4' WHERE lesson_number = 9;
UPDATE public.courses SET video_url = '/videos/urok-10.mp4' WHERE lesson_number = 10;
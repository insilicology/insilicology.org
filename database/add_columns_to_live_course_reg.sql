-- Migration: add Discipline and University columns to live_course_reg
ALTER TABLE IF EXISTS public.live_course_reg
  ADD COLUMN IF NOT EXISTS discipline TEXT,
  ADD COLUMN IF NOT EXISTS university TEXT;

-- Also ensure payment screenshot column exists (saves to payment-ss bucket)
ALTER TABLE IF EXISTS public.live_course_reg
  ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT;



-- Adds new columns to public.courses
-- Dates (text)
-- Language (text)
-- Seats (text)
-- Time (time set)
-- Roadmap (array)
-- Why Join (array)

alter table if exists public.courses
  add column if not exists dates text null,
  add column if not exists language text null,
  add column if not exists seats text null,
  add column if not exists time_set time without time zone null,
  add column if not exists roadmap text[] null,
  add column if not exists why_join text[] null;



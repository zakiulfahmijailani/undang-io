-- Migration: Remove all dummy themes to leave only the code-rendered Sakinah Serenity (fateha-default).
-- This deletes all records from public.themes and public.classic_themes.

DELETE FROM public.themes;
DELETE FROM public.classic_themes;

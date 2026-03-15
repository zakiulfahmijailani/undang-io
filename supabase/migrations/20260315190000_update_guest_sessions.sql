-- Migration: Update guest_sessions table with missing columns for timed publishing flow
-- Adds: status, user_id, converted_to_invitation_id columns
-- Adds: slug uniqueness constraint
-- Adds: UPDATE RLS policy for authenticated users
-- Adds: cleanup function for expired sessions

-- 1. Add missing columns
ALTER TABLE public.guest_sessions
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'preview',
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS converted_to_invitation_id UUID REFERENCES public.invitations(id) ON DELETE SET NULL;

-- 2. Add check constraint for status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'guest_sessions_status_check'
  ) THEN
    ALTER TABLE public.guest_sessions
      ADD CONSTRAINT guest_sessions_status_check
      CHECK (status IN ('preview', 'claimed', 'converted', 'expired'));
  END IF;
END $$;

-- 3. Make slug unique (if not already)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'guest_sessions_slug_unique'
  ) THEN
    ALTER TABLE public.guest_sessions
      ADD CONSTRAINT guest_sessions_slug_unique UNIQUE (slug);
  END IF;
END $$;

-- 4. Ensure INSERT policy exists (belt and suspenders)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'guest_sessions'
    AND policyname = 'Allow public insert to guest_sessions'
  ) THEN
    CREATE POLICY "Allow public insert to guest_sessions" ON public.guest_sessions
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 5. UPDATE policy — authenticated user can update their own claimed session
CREATE POLICY "guest_sessions_update_own" ON public.guest_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. Cleanup function — deletes expired unconverted guest sessions
CREATE OR REPLACE FUNCTION cleanup_expired_guest_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.guest_sessions
  WHERE expires_at < NOW()
  AND converted_to_invitation_id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- To schedule via pg_cron (run in Supabase SQL Editor if pg_cron is enabled):
-- SELECT cron.schedule('cleanup-guest-sessions', '*/5 * * * *',
--   'SELECT cleanup_expired_guest_sessions()');

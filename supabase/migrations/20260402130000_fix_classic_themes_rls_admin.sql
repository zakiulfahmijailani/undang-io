-- ============================================================
-- Fix RLS on classic_themes: allow admin/owner to manage ALL rows
-- including rows where created_by IS NULL (e.g. seeded rows)
-- ============================================================

-- Drop the overly-restrictive owner-only policy
DROP POLICY IF EXISTS "authenticated can manage own classic themes" ON public.classic_themes;

-- Re-add owner policy (non-admin authenticated users can only manage their own rows)
CREATE POLICY "owner can manage own classic themes"
  ON public.classic_themes
  FOR ALL
  TO authenticated
  USING    (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Add admin/owner policy: full access to ALL rows (including seeded / NULL created_by)
CREATE POLICY "admin full access on classic_themes"
  ON public.classic_themes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id   = auth.uid()
        AND profiles.role IN ('admin', 'owner')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id   = auth.uid()
        AND profiles.role IN ('admin', 'owner')
    )
  );

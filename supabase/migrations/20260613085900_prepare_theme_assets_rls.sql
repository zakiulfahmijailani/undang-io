-- ============================================================
-- Migration: 20260613085900_prepare_theme_assets_rls.sql
-- Dibuat   : 13 Juni 2026
-- Tujuan   : Menyiapkan ownership theme_assets sebelum policy RLS ketat.
-- ============================================================

ALTER TABLE public.theme_assets
  ADD COLUMN IF NOT EXISTS invitation_id UUID
  REFERENCES public.invitations(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_theme_assets_invitation_id
  ON public.theme_assets(invitation_id);

-- Semua aset yang sudah ada adalah aset tema bersama karena schema lama
-- belum mendukung aset yang terikat ke undangan.
UPDATE public.theme_assets
SET is_global = true
WHERE invitation_id IS NULL;

DROP POLICY IF EXISTS "authenticated can insert own theme assets" ON public.theme_assets;
DROP POLICY IF EXISTS "authenticated can delete own theme assets" ON public.theme_assets;
DROP POLICY IF EXISTS "Admin full access theme_assets" ON public.theme_assets;
DROP POLICY IF EXISTS "admin full access on theme_assets" ON public.theme_assets;

-- Rollback:
-- DROP INDEX IF EXISTS public.idx_theme_assets_invitation_id;
-- ALTER TABLE public.theme_assets DROP COLUMN IF EXISTS invitation_id;

-- ============================================================
-- END OF MIGRATION
-- ============================================================

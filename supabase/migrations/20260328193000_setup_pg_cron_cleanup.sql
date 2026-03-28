-- ============================================================
-- Migration: setup pg_cron untuk auto-cleanup guest_sessions
-- Jalankan SEKALI. pg_cron berjalan langsung di Postgres,
-- tidak butuh Vercel Pro.
-- ============================================================

-- 1. Aktifkan extension pg_cron
--    (Pastikan sudah di-enable di Supabase Dashboard:
--     Database → Extensions → pg_cron → Enable)
create extension if not exists pg_cron;

-- 2. Grant usage ke postgres role
grant usage on schema cron to postgres;

-- 3. Hapus job lama kalau ada (idempotent)
select cron.unschedule('cleanup-expired-guest-sessions')
where exists (
  select 1 from cron.job where jobname = 'cleanup-expired-guest-sessions'
);

-- 4. Daftarkan cron job — setiap menit
--    Hapus guest_sessions yang:
--      - expires_at sudah lewat + 2 menit grace period
--      - status bukan 'converted' (belum dibayar)
select cron.schedule(
  'cleanup-expired-guest-sessions',   -- nama job (unik)
  '* * * * *',                        -- setiap menit
  $$
    delete from public.guest_sessions
    where
      expires_at < (now() - interval '2 minutes')
      and status != 'converted';
  $$
);

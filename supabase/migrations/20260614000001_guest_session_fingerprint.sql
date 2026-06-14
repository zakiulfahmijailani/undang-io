-- Track guest-session abuse signals for application and database rate limiting.
ALTER TABLE public.guest_sessions
  ADD COLUMN IF NOT EXISTS ip_address inet,
  ADD COLUMN IF NOT EXISTS device_fingerprint text,
  ADD COLUMN IF NOT EXISTS user_agent text;

CREATE INDEX IF NOT EXISTS idx_guest_sessions_ip_created
  ON public.guest_sessions(ip_address, created_at);

CREATE INDEX IF NOT EXISTS idx_guest_sessions_fingerprint_created
  ON public.guest_sessions(device_fingerprint, created_at);

CREATE OR REPLACE FUNCTION public.check_guest_session_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.ip_address IS NOT NULL THEN
    PERFORM pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended('guest-ip:' || NEW.ip_address::text, 0)
    );

    IF (
      SELECT COUNT(*)
      FROM public.guest_sessions
      WHERE ip_address = NEW.ip_address
        AND created_at > now() - interval '1 hour'
    ) >= 5 THEN
      RAISE EXCEPTION 'RATE_LIMIT_IP: too many guest sessions from this IP';
    END IF;
  END IF;

  IF NEW.device_fingerprint IS NOT NULL THEN
    PERFORM pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended('guest-fingerprint:' || NEW.device_fingerprint, 0)
    );

    IF (
      SELECT COUNT(*)
      FROM public.guest_sessions
      WHERE device_fingerprint = NEW.device_fingerprint
        AND created_at > now() - interval '1 hour'
    ) >= 3 THEN
      RAISE EXCEPTION 'RATE_LIMIT_FP: too many guest sessions from this device';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_guest_session_rate_limit ON public.guest_sessions;
CREATE TRIGGER enforce_guest_session_rate_limit
  BEFORE INSERT ON public.guest_sessions
  FOR EACH ROW EXECUTE FUNCTION public.check_guest_session_rate_limit();

-- Rollback:
-- DROP TRIGGER IF EXISTS enforce_guest_session_rate_limit ON public.guest_sessions;
-- DROP FUNCTION IF EXISTS public.check_guest_session_rate_limit();
-- DROP INDEX IF EXISTS public.idx_guest_sessions_fingerprint_created;
-- DROP INDEX IF EXISTS public.idx_guest_sessions_ip_created;
-- ALTER TABLE public.guest_sessions
--   DROP COLUMN IF EXISTS user_agent,
--   DROP COLUMN IF EXISTS device_fingerprint,
--   DROP COLUMN IF EXISTS ip_address;

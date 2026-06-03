-- Migration: set Fateha as the default invitation renderer theme.
-- This keeps explicit Supabase theme selections in invitations.theme_id and uses
-- invitations.theme_key only for code-rendered themes such as Fateha/classic.

alter table public.invitations
  alter column theme_key set default 'fateha-default';

comment on column public.invitations.theme_key is
  'Renderer theme key for code-rendered invitation themes. Default is fateha-default when no explicit Supabase theme is selected.';

-- Rollback:
-- alter table public.invitations alter column theme_key set default 'classic-default';
-- comment on column public.invitations.theme_key is null;

-- Add the converted_to_invitation_id column to track guest session conversion
ALTER TABLE public.guest_sessions
ADD COLUMN IF NOT EXISTS converted_to_invitation_id UUID;

-- Add an index for faster lookups on the new column
CREATE INDEX IF NOT EXISTS idx_guest_sessions_converted_id ON public.guest_sessions(converted_to_invitation_id);

-- Optional: Add a foreign key constraint to ensure data integrity
-- ALTER TABLE public.guest_sessions
-- ADD CONSTRAINT fk_converted_invitation
-- FOREIGN KEY (converted_to_invitation_id)
-- REFERENCES public.invitations(id) ON DELETE SET NULL;

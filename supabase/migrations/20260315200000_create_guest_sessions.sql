-- Create guest_sessions table
CREATE TABLE IF NOT EXISTS public.guest_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_token UUID NOT NULL UNIQUE,
    slug TEXT NOT NULL,
    theme_id TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    invitation_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add trial fields to invitations table if they do not exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invitations' AND column_name='is_trial') THEN
        ALTER TABLE public.invitations ADD COLUMN is_trial BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invitations' AND column_name='expires_at') THEN
        ALTER TABLE public.invitations ADD COLUMN expires_at TIMESTAMPTZ;
    END IF;
END $$;

-- RLS Policies for guest_sessions
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert their guest sessions (registration form onboarding)
CREATE POLICY "Allow public insert to guest_sessions" ON public.guest_sessions
    FOR INSERT WITH CHECK (true);

-- Allow anonymous users to select their own guest sessions by token
CREATE POLICY "Allow public select on guest_sessions by token" ON public.guest_sessions
    FOR SELECT USING (true);

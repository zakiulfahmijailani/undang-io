-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users & Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'admin', 'owner'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Themes
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- 'Free', 'Premium'
  price INTEGER DEFAULT 0,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invitations
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  theme_id UUID REFERENCES public.themes(id),
  plan_id UUID REFERENCES public.subscription_plans(id),
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invitation Content
CREATE TABLE IF NOT EXISTS public.invitation_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
  groom_name TEXT,
  groom_nickname TEXT,
  groom_parents TEXT,
  bride_name TEXT,
  bride_nickname TEXT,
  bride_parents TEXT,
  event_type TEXT, -- 'akad', 'resepsi', 'both'
  event_date TIMESTAMP WITH TIME ZONE,
  event_time TEXT,
  venue_name TEXT,
  venue_address TEXT,
  maps_url TEXT,
  greeting_text TEXT,
  love_story TEXT,
  photos JSONB,
  qris_image_url TEXT,
  bank_accounts JSONB,
  music_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVP
CREATE TABLE IF NOT EXISTS public.rsvp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  attendance_status TEXT NOT NULL, -- 'hadir', 'tidak_hadir'
  number_of_guests INTEGER DEFAULT 1,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guestbook
CREATE TABLE IF NOT EXISTS public.guestbook (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS setup (Row Level Security)

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile when auth.user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Themes (Everyone can read)
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Themes are viewable by everyone" ON public.themes FOR SELECT USING (true);

-- Subscription Plans (Everyone can read)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans are viewable by everyone" ON public.subscription_plans FOR SELECT USING (true);

-- Invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own invitations" ON public.invitations USING (auth.uid() = user_id);
-- Allow public read access to published invitations
CREATE POLICY "Public can view published invitations" ON public.invitations FOR SELECT USING (status = 'published');

-- Invitation Content
ALTER TABLE public.invitation_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage content of their invitations" ON public.invitation_content 
  USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_id AND invitations.user_id = auth.uid()));
CREATE POLICY "Public can view content of published invitations" ON public.invitation_content 
  FOR SELECT USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_id AND invitations.status = 'published'));

-- RSVP (Public can insert, owner can read)
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert RSVP" ON public.rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view RSVP" ON public.rsvp FOR SELECT 
  USING (EXISTS (SELECT 1 FROM invitations WHERE invitations.id = invitation_id AND invitations.user_id = auth.uid()));

-- Guestbook (Public can insert & read)
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert Guestbook" ON public.guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view visible Guestbook entries" ON public.guestbook FOR SELECT USING (is_visible = true);

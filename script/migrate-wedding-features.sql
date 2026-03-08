-- ==========================================
-- joy-knot Wedding Features Migration Script
-- ==========================================

-- 1. Tabel Tema (themes)
CREATE TABLE public.themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    background_type VARCHAR(50) DEFAULT 'image', -- 'image' atau 'color'
    background_value TEXT, -- url gambar atau hex color
    music_url TEXT,
    is_premium BOOLEAN DEFAULT false,
    price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Detail Konten Undangan Lengkap (invitation_details)
-- Menyimpan JSON terstruktur untuk Wedding Dates, Mempelai, Love Story, Gallery, dll.
CREATE TABLE public.invitation_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    
    -- Data Mempelai
    couple_short_name VARCHAR(255),
    groom_full_name VARCHAR(255),
    groom_father_name VARCHAR(255),
    groom_mother_name VARCHAR(255),
    groom_photo_url TEXT,
    
    bride_full_name VARCHAR(255),
    bride_father_name VARCHAR(255),
    bride_mother_name VARCHAR(255),
    bride_photo_url TEXT,
    
    -- Visual Assets
    cover_photo_url TEXT,
    hero_photo_url TEXT,
    
    -- Acara Utama
    akad_date TIMESTAMP WITH TIME ZONE,
    akad_venue VARCHAR(255),
    akad_address TEXT,
    akad_maps_url TEXT,
    
    reception_date TIMESTAMP WITH TIME ZONE,
    reception_venue VARCHAR(255),
    reception_address TEXT,
    reception_maps_url TEXT,
    
    -- Metadata dan Teks
    quote_text TEXT,
    quote_source VARCHAR(255),
    dress_code_desc VARCHAR(255),
    dress_code_colors JSONB, -- Array of hex codes ["#FF0000", "#00FF00"]
    
    love_story JSONB, -- Array of objects: [{date, title, description, photo}]
    gallery_photos JSONB, -- Array of strings: ["url1", "url2"]
    
    -- Digital Gift
    bank_accounts JSONB, -- Array of objects: [{bank, number, name}]
    gift_address TEXT,
    qris_photo_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(invitation_id)
);

-- 3. Tabel RSVP & Ucapan Hadir (rsvp_messages)
CREATE TABLE public.rsvp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    
    guest_name VARCHAR(255) NOT NULL,
    attendance_status VARCHAR(50) NOT NULL CHECK (attendance_status IN ('hadir', 'tidak_hadir', 'ragu')),
    message_text TEXT,
    guest_count INTEGER DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_messages ENABLE ROW LEVEL SECURITY;

-- Themes: Semua orang bisa baca (public), hanya Admin yg bisa insert/update
CREATE POLICY "Themes are viewable by everyone" ON public.themes
    FOR SELECT USING (true);

CREATE POLICY "Waitlist: Only superadmin can manage themes" ON public.themes
    FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Invitation Details: Semua orang bisa baca, hanya owner yang bisa ubah
CREATE POLICY "Invitation details viewable by everyone" ON public.invitation_details
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their invitation details" ON public.invitation_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.invitations 
            WHERE id = invitation_details.invitation_id AND user_id = auth.uid()
        )
    );

-- RSVP Messages: Semua orang bisa insert (tamu), dan bisa baca (public)
CREATE POLICY "Anyone can create RSVP" ON public.rsvp_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view RSVP" ON public.rsvp_messages
    FOR SELECT USING (true);

CREATE POLICY "Users can delete RSVPs on their invitation" ON public.rsvp_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.invitations
            WHERE id = rsvp_messages.invitation_id AND user_id = auth.uid()
        )
    );

-- NikahKu MVP Seed Data
-- Run this script in the Supabase SQL Editor AFTER running db-setup.sql

-- 1. Seed Subscription Plans
INSERT INTO public.subscription_plans (name, price, features)
VALUES 
  ('Gratis', 0, '{"max_photos": 3, "ai_copywriting": false, "custom_domain": false}'::jsonb),
  ('Premium', 99000, '{"max_photos": 20, "ai_copywriting": true, "custom_domain": false}'::jsonb)
ON CONFLICT DO NOTHING;

-- 2. Seed Initial Themes
INSERT INTO public.themes (name, slug, description, category, tags, is_premium, thumbnail_url, demo_url)
VALUES 
  (
    'Minimalist White', 
    'minimalist-white', 
    'Tema putih bersih yang elegan dan minimalis', 
    'minimalist', 
    ARRAY['gratis', 'minimalist', 'clean'], 
    false, 
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400', 
    '/u/sample?theme=minimalist-white'
  ),
  (
    'Garden Romance', 
    'garden-romance', 
    'Tema bernuansa alam dengan ilustrasi bunga dan dedaunan', 
    'floral', 
    ARRAY['gratis', 'floral', 'nature', 'green'], 
    false, 
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400', 
    '/u/sample?theme=garden-romance'
  ),
  (
    'Classic Javanese', 
    'classic-javanese', 
    'Tema elegan dengan ornamen klasik khas Jawa', 
    'adat', 
    ARRAY['premium', 'jawa', 'classic', 'gold'], 
    true, 
    'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=400', 
    '/u/sample?theme=classic-javanese'
  ),
  (
    'Modern Bold', 
    'modern-bold', 
    'Tema dengan tipografi yang kuat dan warna-warna gelap', 
    'modern', 
    ARRAY['premium', 'modern', 'bold', 'dark'], 
    true, 
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=400', 
    '/u/sample?theme=modern-bold'
  ),
  (
    'Rustic Boho', 
    'rustic-boho', 
    'Tema tenang dengan tekstur natural dan warna bumi', 
    'rustic', 
    ARRAY['premium', 'rustic', 'boho', 'earthtone'], 
    true, 
    'https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?auto=format&fit=crop&q=80&w=400', 
    '/u/sample?theme=rustic-boho'
  ),
  (
    'Sundanese Elegance', 
    'sundanese-elegance', 
    'Tema anggun bernuansa adat Sunda', 
    'adat', 
    ARRAY['premium', 'sunda', 'elegant', 'maroon'], 
    true, 
    'https://images.unsplash.com/photo-1516962080544-eac695c935d2?auto=format&fit=crop&q=80&w=400', 
    '/u/sample?theme=sundanese-elegance'
  )
ON CONFLICT (slug) DO NOTHING;

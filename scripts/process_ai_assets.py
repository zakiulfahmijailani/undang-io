import os
import sys
import glob
from pathlib import Path
from datetime import datetime, timezone
import subprocess

def install_deps():
    try:
        import rembg
        import onnxruntime
        from PIL import Image
        import supabase
    except ImportError:
        print("Installing dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "rembg[cpu]", "pillow", "supabase"])

install_deps()

from PIL import Image
from rembg import remove
from supabase import create_client

# ──────────────────────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────────────────────
ARTIFACTS_DIR = r"C:\Users\zakiu\.gemini\antigravity\brain\baa84223-5d0c-494c-9b94-911506950a97"
THEME_KEY = "default-parallax"

ENV_FILE = Path(__file__).parent.parent / '.env.local'

def load_env():
    env = {}
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()
    return env

env = load_env()
supabase = create_client(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'])

ASSETS_SPEC = {
    'cover_scene': {'size': (1200, 1800), 'transparent': False, 'label': 'Cover Scene'},
    'left_panel_alt': {'size': (800, 1200), 'transparent': False, 'label': 'Ilustrasi Panel Kiri / Data Mempelai'},
    'footer_scene': {'size': (1200, 600), 'transparent': False, 'label': 'Ilustrasi Footer'},
    'corner_tl': {'size': (400, 400), 'transparent': True, 'label': 'Pojok Kiri Atas'},
    'corner_tr': {'size': (400, 400), 'transparent': True, 'label': 'Pojok Kanan Atas'},
    'corner_bl': {'size': (400, 400), 'transparent': True, 'label': 'Pojok Kiri Bawah'},
    'corner_br': {'size': (400, 400), 'transparent': True, 'label': 'Pojok Kanan Bawah'},
    'divider_main': {'size': (1200, 120), 'transparent': True, 'label': 'Divider Utama'},
    'divider_alt': {'size': (1200, 120), 'transparent': True, 'label': 'Divider Alternatif'},
    'pattern_main': {'size': (400, 400), 'transparent': True, 'label': 'Pattern Utama'},
    'pattern_alt': {'size': (400, 400), 'transparent': True, 'label': 'Pattern Alternatif'},
    'frame_couple': {'size': (500, 600), 'transparent': True, 'label': 'Frame Foto Pengantin'},
    'icon_venue': {'size': (200, 200), 'transparent': True, 'label': 'Ikon Venue / Lokasi'},
    'illustration_iconic': {'size': (700, 400), 'transparent': True, 'label': 'Ilustrasi Ikonik'},
    'banner_top': {'size': (1200, 200), 'transparent': True, 'label': 'Banner Dekoratif Atas'},
}

def get_latest_file(slot):
    files = glob.glob(os.path.join(ARTIFACTS_DIR, f"{slot}_*.png"))
    if not files:
        return None
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]

def process_and_upload():
    # Get Theme ID
    res = supabase.table('themes').select('id').eq('theme_key', THEME_KEY).execute()
    if not res.data:
        print(f"Theme {THEME_KEY} not found")
        return
    theme_id = res.data[0]['id']

    out_dir = Path(__file__).parent.parent / "public" / "placeholder_output"
    out_dir.mkdir(parents=True, exist_ok=True)

    for slot, spec in ASSETS_SPEC.items():
        src_path = get_latest_file(slot)
        if not src_path:
            print(f"Skipping {slot}: No generated image found in artifacts.")
            continue

        print(f"Processing {slot}...")
        img = Image.open(src_path).convert("RGBA")

        # 1. Background Removal
        if spec['transparent']:
            print(f"  Removing background for {slot}...")
            img = remove(img)

        # 2. Resize maintaining aspect ratio but cropping to fit exact size
        target_size = spec['size']
        print(f"  Resizing {slot} to {target_size}...")
        
        # Calculate aspect ratios
        target_ratio = target_size[0] / target_size[1]
        img_ratio = img.width / img.height
        
        if img_ratio > target_ratio:
            # Image is wider than target
            new_width = int(target_ratio * img.height)
            offset = (img.width - new_width) // 2
            img = img.crop((offset, 0, offset + new_width, img.height))
        elif img_ratio < target_ratio:
            # Image is taller than target
            new_height = int(img.width / target_ratio)
            offset = (img.height - new_height) // 2
            img = img.crop((0, offset, img.width, offset + new_height))
            
        img = img.resize(target_size, Image.Resampling.LANCZOS)

        # Save to temp
        out_path = out_dir / f"{slot}.png"
        img.save(out_path, format="PNG")
        
        # 3. Upload to Supabase Storage
        print(f"  Uploading {slot} to storage...")
        storage_path = f"themes/{THEME_KEY}/{slot}.png"
        with open(out_path, 'rb') as f:
            file_bytes = f.read()
        
        supabase.storage.from_('theme-assets').upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": "image/png", "upsert": "true"}
        )
        
        public_url_resp = supabase.storage.from_('theme-assets').get_public_url(storage_path)
        public_url = f"{public_url_resp}?t={int(datetime.now(timezone.utc).timestamp())}"

        # 4. Upsert into database
        print(f"  Updating database for {slot}...")
        upsert_data = {
            'theme_id': theme_id,
            'theme_key': THEME_KEY,
            'slot': slot,
            'file_url': public_url,
            'storage_path': storage_path,
            'uploaded_at': datetime.now(timezone.utc).isoformat(),
            'mime_type': 'image/png',
            'file_size_bytes': out_path.stat().st_size,
            'is_transparent': spec['transparent'],
            'kind': slot,
            'image_url': public_url,
            'label': spec['label'],
        }
        
        existing = supabase.table('theme_assets').select('id').eq('theme_id', theme_id).eq('slot', slot).execute()
        
        if existing.data and len(existing.data) > 0:
            supabase.table('theme_assets').update(upsert_data).eq('id', existing.data[0]['id']).execute()
        else:
            supabase.table('theme_assets').insert(upsert_data).execute()

    print("All assets processed and uploaded successfully!")

if __name__ == "__main__":
    process_and_upload()

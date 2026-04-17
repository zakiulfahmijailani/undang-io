"""
Generate placeholder PNG assets for all theme asset slots,
upload to Supabase Storage, and insert records into theme_assets table.

Usage:
  python scripts/generate_placeholder_assets.py [theme_key]
  
If no theme_key is provided, lists all available themes.
"""

import os
import sys
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# ──────────────────────────────────────────────────────────────
# Load .env.local
# ──────────────────────────────────────────────────────────────
ENV_FILE = Path(__file__).parent.parent / '.env.local'

def load_env():
    if not ENV_FILE.exists():
        print(f"ERROR: {ENV_FILE} not found")
        sys.exit(1)
    env = {}
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()
            os.environ[k.strip()] = v.strip()
    return env

env = load_env()
SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
SUPABASE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']

# ──────────────────────────────────────────────────────────────
# Palette — elegant wedding theme
# ──────────────────────────────────────────────────────────────
CREAM      = (245, 240, 232)
BLUSH      = (232, 180, 184)
SAGE       = (143, 175, 143)
ROSE       = (201, 116, 122)
DUSTY_ROSE = (181, 115, 122)
GOLD       = (212, 175, 55)
GOLD_LIGHT = (212, 175, 55, 180)
WARM_BROWN = (139, 105, 20)
WHITE      = (255, 255, 255)
WHITE_A    = (255, 255, 255, 220)
DARK       = (74, 50, 53)

OUT_DIR = Path(__file__).parent.parent / 'tmp' / 'theme-assets'

# ──────────────────────────────────────────────────────────────
# ASSET_SLOTS — matches the codebase exactly
# ──────────────────────────────────────────────────────────────
ASSET_SLOTS = [
    # Scene & Background
    {'slot': 'cover_scene',     'label': 'Cover Scene',         'size': (1200, 1800), 'transparent': False, 'group': 'Scene & Background'},
    {'slot': 'left_panel_alt',  'label': 'Ilustrasi Panel Kiri','size': (800, 1200),  'transparent': False, 'group': 'Scene & Background'},
    {'slot': 'footer_scene',    'label': 'Ilustrasi Footer',    'size': (1200, 600),  'transparent': False, 'group': 'Scene & Background'},
    # Ornamen Corner
    {'slot': 'corner_tl',       'label': 'Pojok Kiri Atas',     'size': (400, 400),   'transparent': True,  'group': 'Ornamen Corner'},
    {'slot': 'corner_tr',       'label': 'Pojok Kanan Atas',    'size': (400, 400),   'transparent': True,  'group': 'Ornamen Corner'},
    {'slot': 'corner_bl',       'label': 'Pojok Kiri Bawah',    'size': (400, 400),   'transparent': True,  'group': 'Ornamen Corner'},
    {'slot': 'corner_br',       'label': 'Pojok Kanan Bawah',   'size': (400, 400),   'transparent': True,  'group': 'Ornamen Corner'},
    # Divider & Pattern
    {'slot': 'divider_main',    'label': 'Divider Utama',       'size': (1200, 120),  'transparent': True,  'group': 'Divider & Pattern'},
    {'slot': 'divider_alt',     'label': 'Divider Alternatif',  'size': (1200, 120),  'transparent': True,  'group': 'Divider & Pattern'},
    {'slot': 'pattern_main',    'label': 'Pattern Utama',       'size': (400, 400),   'transparent': True,  'group': 'Divider & Pattern'},
    {'slot': 'pattern_alt',     'label': 'Pattern Alternatif',  'size': (400, 400),   'transparent': True,  'group': 'Divider & Pattern'},
    # Frame & Ikon
    {'slot': 'frame_couple',    'label': 'Frame Foto Pengantin','size': (500, 600),   'transparent': True,  'group': 'Frame & Ikon'},
    {'slot': 'icon_venue',      'label': 'Ikon Venue',          'size': (200, 200),   'transparent': True,  'group': 'Frame & Ikon'},
    # Dekoratif
    {'slot': 'illustration_iconic', 'label': 'Ilustrasi Ikonik','size': (700, 400),   'transparent': True,  'group': 'Dekoratif'},
    {'slot': 'banner_top',      'label': 'Banner Dekoratif',    'size': (1200, 200),  'transparent': True,  'group': 'Dekoratif'},
    # Media — skip music
]


# ══════════════════════════════════════════════════════════════
# Drawing helpers
# ══════════════════════════════════════════════════════════════

def get_font(size=24):
    """Get a font, falling back gracefully."""
    for name in ['arial.ttf', 'Arial.ttf', 'DejaVuSans.ttf', 'LiberationSans-Regular.ttf']:
        try:
            return ImageFont.truetype(name, size)
        except (IOError, OSError):
            pass
    return ImageFont.load_default()


def draw_centered_text(draw, img_size, text, font, fill=WHITE, shadow=True):
    """Draw text centered on image with optional shadow."""
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (img_size[0] - tw) // 2
    y = (img_size[1] - th) // 2
    if shadow:
        draw.text((x + 2, y + 2), text, font=font, fill=(0, 0, 0, 100) if len(fill) == 4 else (50, 30, 30))
    draw.text((x, y), text, font=font, fill=fill)


def make_gradient_rgb(w, h, color_top, color_bottom):
    """Create RGB gradient image."""
    img = Image.new('RGB', (w, h))
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(color_top[0] + (color_bottom[0] - color_top[0]) * t)
        g = int(color_top[1] + (color_bottom[1] - color_top[1]) * t)
        b = int(color_top[2] + (color_bottom[2] - color_top[2]) * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return img


def draw_leaf_cluster(draw, cx, cy, scale=1.0, color=GOLD_LIGHT, flip_x=False, flip_y=False):
    """Draw a simple ornamental leaf/petal cluster."""
    petals = [
        # (angle_offset, length, width)
        (0, 80, 25),
        (35, 65, 20),
        (-35, 65, 20),
        (60, 45, 15),
        (-60, 45, 15),
        (85, 30, 12),
        (-85, 30, 12),
    ]
    for angle_deg, length, width in petals:
        angle = math.radians(angle_deg)
        l = length * scale
        w = width * scale
        
        # Direction
        dx_sign = -1 if flip_x else 1
        dy_sign = -1 if flip_y else 1
        
        ex = cx + dx_sign * math.sin(angle) * l
        ey = cy - dy_sign * math.cos(angle) * l
        
        # Draw ellipse petal
        mid_x = (cx + ex) / 2
        mid_y = (cy + ey) / 2
        bbox = [mid_x - w/2, mid_y - l/2 * 0.6, mid_x + w/2, mid_y + l/2 * 0.6]
        draw.ellipse(bbox, fill=color, outline=(GOLD[0], GOLD[1], GOLD[2], 100))
    
    # Center dot
    r = 6 * scale
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)


def draw_small_flower(draw, cx, cy, r=8, color=GOLD_LIGHT):
    """Draw a tiny 5-petal flower."""
    for i in range(5):
        angle = math.radians(i * 72 - 90)
        px = cx + math.cos(angle) * r
        py = cy + math.sin(angle) * r
        pr = r * 0.6
        draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=color)
    # Center
    cr = r * 0.35
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=(WARM_BROWN[0], WARM_BROWN[1], WARM_BROWN[2], 200))


# ══════════════════════════════════════════════════════════════
# Asset generators
# ══════════════════════════════════════════════════════════════

def gen_cover_scene(w, h):
    """Gradient cream → blush pink, text label."""
    img = make_gradient_rgb(w, h, CREAM, BLUSH)
    draw = ImageDraw.Draw(img)
    
    # Subtle decorative circles
    for i in range(5):
        cx = w // 2 + (i - 2) * 120
        cy = h // 3
        r = 40 + i * 10
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(*DUSTY_ROSE, ), width=2)
    
    font_big = get_font(64)
    font_sm = get_font(28)
    draw_centered_text(draw, (w, h - 200), "Cover Scene", font_big, fill=DARK)
    draw_centered_text(draw, (w, h + 200), "1200 × 1800 px", font_sm, fill=(*DUSTY_ROSE,))
    return img


def gen_left_panel(w, h):
    """Sage green gradient, text label."""
    img = make_gradient_rgb(w, h, (200, 220, 200), SAGE)
    draw = ImageDraw.Draw(img)
    
    # Decorative vertical line
    draw.line([(w//2, 80), (w//2, h-80)], fill=(*DARK,), width=1)
    draw.ellipse([w//2 - 8, h//2 - 8, w//2 + 8, h//2 + 8], fill=SAGE)
    
    font_big = get_font(48)
    font_sm = get_font(22)
    draw_centered_text(draw, (w, h - 100), "Panel Kiri", font_big, fill=DARK)
    draw_centered_text(draw, (w, h + 100), "800 × 1200 px", font_sm, fill=DARK)
    return img


def gen_footer(w, h):
    """Dusty rose horizontal gradient, text."""
    img = make_gradient_rgb(w, h, ROSE, DUSTY_ROSE)
    draw = ImageDraw.Draw(img)
    font = get_font(48)
    font_sm = get_font(22)
    draw_centered_text(draw, (w, h - 60), "Footer Scene", font, fill=WHITE)
    draw_centered_text(draw, (w, h + 60), "1200 × 600 px", font_sm, fill=WHITE)
    return img


def gen_corner(w, h, position):
    """Transparent PNG with leaf ornament in a corner."""
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    flip_x = 'right' in position or position in ('corner_tr', 'corner_br')
    flip_y = 'bottom' in position or position in ('corner_bl', 'corner_br')
    
    # Anchor point
    cx = w - 30 if flip_x else 30
    cy = h - 30 if flip_y else 30
    
    draw_leaf_cluster(draw, cx, cy, scale=1.8, color=GOLD_LIGHT, flip_x=flip_x, flip_y=flip_y)
    
    # Curved vine line
    points = []
    for i in range(30):
        t = i / 29
        x_sign = -1 if flip_x else 1
        y_sign = -1 if flip_y else 1
        px = cx + x_sign * t * (w * 0.7)
        py = cy + y_sign * t * (h * 0.7) + math.sin(t * math.pi * 2) * 20
        points.append((px, py))
    
    if len(points) > 1:
        draw.line(points, fill=(GOLD[0], GOLD[1], GOLD[2], 120), width=2)
    
    # Small flowers along the vine
    for i in range(0, len(points), 8):
        draw_small_flower(draw, points[i][0], points[i][1], r=6, color=GOLD_LIGHT)
    
    return img


def gen_divider_main(w, h):
    """Transparent with center line and flower ornament."""
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cy = h // 2
    # Gradient line — two halves
    for x in range(w):
        t = abs(x - w/2) / (w/2)
        alpha = int(150 * (1 - t * t))
        draw.point((x, cy), fill=(GOLD[0], GOLD[1], GOLD[2], alpha))
        draw.point((x, cy + 1), fill=(GOLD[0], GOLD[1], GOLD[2], alpha // 2))
    
    # Center flower
    draw_small_flower(draw, w // 2, cy, r=14, color=GOLD_LIGHT)
    
    # Side flowers
    for offset in [-180, -100, 100, 180]:
        draw_small_flower(draw, w // 2 + offset, cy, r=7, color=(GOLD[0], GOLD[1], GOLD[2], 140))
    
    return img


def gen_divider_alt(w, h):
    """Transparent with decorative dashed line."""
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cy = h // 2
    dash_len = 12
    gap_len = 8
    x = 100
    while x < w - 100:
        alpha = int(180 * (1 - abs(x - w/2) / (w/2 - 50)))
        draw.line([(x, cy), (x + dash_len, cy)], fill=(GOLD[0], GOLD[1], GOLD[2], max(alpha, 30)), width=2)
        x += dash_len + gap_len
    
    # Decorative dots at the center
    for dx in [-6, 0, 6]:
        draw.ellipse([w//2 + dx - 3, cy - 3, w//2 + dx + 3, cy + 3], 
                      fill=(GOLD[0], GOLD[1], GOLD[2], 200))
    
    return img


def gen_pattern_main(w, h):
    """Transparent dot pattern grid."""
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    spacing = w // 8
    dot_r = 4
    for row in range(8):
        for col in range(8):
            cx = spacing // 2 + col * spacing
            cy = spacing // 2 + row * spacing
            alpha = 100 + ((row + col) % 3) * 40
            draw.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r],
                         fill=(GOLD[0], GOLD[1], GOLD[2], alpha))
    
    return img


def gen_pattern_alt(w, h):
    """Transparent diagonal line pattern."""
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    spacing = 30
    for offset in range(-h, w + h, spacing):
        alpha = 60 + (offset % (spacing * 3) == 0) * 40
        draw.line([(offset, 0), (offset + h, h)], fill=(GOLD[0], GOLD[1], GOLD[2], alpha), width=1)
    
    return img


def gen_frame_couple(w, h):
    """Transparent with decorative border frame."""
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    margin = 30
    # Outer border
    draw.rounded_rectangle([margin, margin, w - margin, h - margin], 
                           radius=20, outline=(GOLD[0], GOLD[1], GOLD[2], 180), width=3)
    # Inner border
    draw.rounded_rectangle([margin + 12, margin + 12, w - margin - 12, h - margin - 12],
                           radius=14, outline=(GOLD[0], GOLD[1], GOLD[2], 100), width=1)
    
    # Corner ornaments
    for (cx, cy, fx, fy) in [(margin + 15, margin + 15, False, False),
                              (w - margin - 15, margin + 15, True, False),
                              (margin + 15, h - margin - 15, False, True),
                              (w - margin - 15, h - margin - 15, True, True)]:
        draw_leaf_cluster(draw, cx, cy, scale=0.5, color=GOLD_LIGHT, flip_x=fx, flip_y=fy)
    
    # Center placeholder text
    font = get_font(20)
    draw_centered_text(draw, (w, h), "Foto Pengantin", font, fill=(GOLD[0], GOLD[1], GOLD[2], 150))
    
    return img


def gen_icon_venue(w, h):
    """Transparent location pin icon."""
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx, cy = w // 2, h // 2 - 15
    
    # Pin body (teardrop) using polygon
    pin_points = []
    # Upper circle
    r = 40
    for angle_deg in range(0, 360, 5):
        angle = math.radians(angle_deg)
        px = cx + r * math.cos(angle)
        py = cy + r * math.sin(angle) * 0.85
        pin_points.append((px, py))
    
    # Draw filled circle
    draw.ellipse([cx - r, cy - r + 5, cx + r, cy + r - 5], 
                 fill=(GOLD[0], GOLD[1], GOLD[2], 200), 
                 outline=(WARM_BROWN[0], WARM_BROWN[1], WARM_BROWN[2], 200), width=2)
    
    # Pin point (triangle)
    draw.polygon([(cx - 18, cy + 25), (cx, cy + 70), (cx + 18, cy + 25)],
                 fill=(GOLD[0], GOLD[1], GOLD[2], 200))
    
    # Inner circle (white)
    ir = 20
    draw.ellipse([cx - ir, cy - ir + 5, cx + ir, cy + ir - 5],
                 fill=(255, 255, 255, 180))
    
    # Small cross in center
    draw.line([(cx - 6, cy), (cx + 6, cy)], fill=(GOLD[0], GOLD[1], GOLD[2], 200), width=2)
    draw.line([(cx, cy - 6), (cx, cy + 6)], fill=(GOLD[0], GOLD[1], GOLD[2], 200), width=2)
    
    return img


def gen_illustration_iconic(w, h):
    """Transparent iconic illustration placeholder."""
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx, cy = w // 2, h // 2
    
    # Decorative arch/dome shape
    for i in range(3):
        r = 120 - i * 25
        alpha = 160 - i * 40
        draw.arc([cx - r, cy - r - 30, cx + r, cy + r - 30], 
                 start=200, end=340, fill=(GOLD[0], GOLD[1], GOLD[2], alpha), width=3)
    
    # Pillars
    for dx in [-80, 80]:
        draw.rectangle([cx + dx - 8, cy - 20, cx + dx + 8, cy + 80],
                       fill=(GOLD[0], GOLD[1], GOLD[2], 120))
    
    # Base line
    draw.line([(cx - 120, cy + 80), (cx + 120, cy + 80)], 
              fill=(GOLD[0], GOLD[1], GOLD[2], 160), width=2)
    
    # Label
    font = get_font(18)
    draw_centered_text(draw, (w, h + 140), "Ilustrasi Ikonik", font, 
                       fill=(GOLD[0], GOLD[1], GOLD[2], 160))
    
    return img


def gen_banner_top(w, h):
    """Transparent decorative banner."""
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cy = h // 2
    
    # Wavy line across
    points = []
    for x in range(0, w, 3):
        t = x / w
        edge_fade = min(t, 1 - t) * 4
        edge_fade = min(edge_fade, 1.0)
        y = cy + math.sin(x * 0.02) * 15 * edge_fade
        points.append((x, y))
    
    if len(points) > 1:
        draw.line(points, fill=(GOLD[0], GOLD[1], GOLD[2], 140), width=2)
    
    # Flowers along the banner
    for x_pos in range(100, w - 100, 150):
        t = x_pos / w
        edge_fade = min(t, 1 - t) * 4
        alpha = int(180 * min(edge_fade, 1.0))
        y_pos = cy + math.sin(x_pos * 0.02) * 15 * min(edge_fade, 1.0)
        draw_small_flower(draw, x_pos, y_pos, r=10, 
                          color=(GOLD[0], GOLD[1], GOLD[2], alpha))
    
    return img


# ══════════════════════════════════════════════════════════════
# Main generation dispatcher
# ══════════════════════════════════════════════════════════════

GENERATORS = {
    'cover_scene':         lambda s: gen_cover_scene(*s),
    'left_panel_alt':      lambda s: gen_left_panel(*s),
    'footer_scene':        lambda s: gen_footer(*s),
    'corner_tl':           lambda s: gen_corner(*s, 'corner_tl'),
    'corner_tr':           lambda s: gen_corner(*s, 'corner_tr'),
    'corner_bl':           lambda s: gen_corner(*s, 'corner_bl'),
    'corner_br':           lambda s: gen_corner(*s, 'corner_br'),
    'divider_main':        lambda s: gen_divider_main(*s),
    'divider_alt':         lambda s: gen_divider_alt(*s),
    'pattern_main':        lambda s: gen_pattern_main(*s),
    'pattern_alt':         lambda s: gen_pattern_alt(*s),
    'frame_couple':        lambda s: gen_frame_couple(*s),
    'icon_venue':          lambda s: gen_icon_venue(*s),
    'illustration_iconic': lambda s: gen_illustration_iconic(*s),
    'banner_top':          lambda s: gen_banner_top(*s),
}


def generate_all():
    """Generate all placeholder PNGs."""
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    
    for spec in ASSET_SLOTS:
        slot = spec['slot']
        size = spec['size']
        is_transparent = spec['transparent']
        
        gen_fn = GENERATORS.get(slot)
        if not gen_fn:
            print(f"  ⚠ No generator for {slot}, skipping")
            continue
        
        img = gen_fn(size)
        
        filepath = OUT_DIR / f"{slot}.png"
        img.save(str(filepath), 'PNG', optimize=True)
        
        file_size = filepath.stat().st_size
        mode = img.mode
        
        results.append({
            'slot': slot,
            'label': spec['label'],
            'filepath': filepath,
            'size_bytes': file_size,
            'dimensions': size,
            'mode': mode,
            'transparent': is_transparent,
        })
        
        status = "✓ RGBA" if mode == 'RGBA' else "✓ RGB"
        print(f"  {status}  {slot}.png  ({size[0]}×{size[1]})  {file_size/1024:.1f} KB")
    
    return results


# ══════════════════════════════════════════════════════════════
# Supabase upload + DB insert
# ══════════════════════════════════════════════════════════════

def upload_and_register(results, theme_key):
    """Upload PNGs to Supabase Storage and register in theme_assets table."""
    from supabase import create_client
    from datetime import datetime, timezone
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 1. Get theme record to find theme_id
    theme_resp = supabase.table('themes').select('id').eq('slug', theme_key).single().execute()
    
    if not theme_resp.data:
        print(f"\n❌ Theme with slug '{theme_key}' not found!")
        # List available themes
        themes = supabase.table('themes').select('slug, name').execute()
        if themes.data:
            print("\nAvailable themes:")
            for t in themes.data:
                print(f"  • {t['slug']}  —  {t.get('name', '?')}")
        return False
    
    theme_id = theme_resp.data['id']
    print(f"\n📦 Theme: {theme_key} (id: {theme_id})")
    
    uploaded = 0
    registered = 0
    
    for item in results:
        slot = item['slot']
        filepath = item['filepath']
        storage_path = f"themes/{theme_key}/{slot}.png"
        
        # Upload to storage
        try:
            with open(filepath, 'rb') as f:
                file_bytes = f.read()
            
            supabase.storage.from_('theme-assets').upload(
                path=storage_path,
                file=file_bytes,
                file_options={"content-type": "image/png", "upsert": "true"}
            )
            uploaded += 1
            
            # Get public URL
            public_url_resp = supabase.storage.from_('theme-assets').get_public_url(storage_path)
            public_url = f"{public_url_resp}?t={int(datetime.now(timezone.utc).timestamp())}"
            
            # Upsert into theme_assets table
            upsert_data = {
                'theme_id': theme_id,
                'theme_key': theme_key,
                'slot': slot,
                'file_url': public_url,
                'storage_path': storage_path,
                'uploaded_at': datetime.now(timezone.utc).isoformat(),
                'mime_type': 'image/png',
                'file_size_bytes': item['size_bytes'],
                'is_transparent': item['transparent'],
                'kind': slot,
                'image_url': public_url,
                'label': item['label'],
            }
            
            # Manual upsert to avoid constraints issue
            existing = supabase.table('theme_assets').select('id').eq('theme_id', theme_id).eq('slot', slot).execute()
            
            if existing.data and len(existing.data) > 0:
                # Update
                asset_id = existing.data[0]['id']
                supabase.table('theme_assets').update(upsert_data).eq('id', asset_id).execute()
            else:
                # Insert
                supabase.table('theme_assets').insert(upsert_data).execute()
                
            registered += 1
            
            print(f"  ✓ {slot} → uploaded + registered")
            
        except Exception as e:
            print(f"  ✗ {slot} → ERROR: {e}")
    
    return uploaded, registered


# ══════════════════════════════════════════════════════════════
# CLI entry point
# ══════════════════════════════════════════════════════════════

def list_themes():
    """List all available themes."""
    from supabase import create_client
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    themes = supabase.table('themes').select('slug, name, is_active').execute()
    if themes.data:
        print("\n📋 Available themes:")
        for t in themes.data:
            status = "🟢" if t.get('is_active') else "⚪"
            print(f"  {status} {t['slug']}  —  {t.get('name', '?')}")
    else:
        print("\n❌ No themes found in database")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python generate_placeholder_assets.py <theme_key>")
        list_themes()
        sys.exit(0)
    
    theme_key = sys.argv[1]
    
    print(f"🎨 Generating placeholder assets for theme: {theme_key}")
    print(f"   Output dir: {OUT_DIR}\n")
    
    # Step 1: Generate PNGs
    print("── Step 1: Generating PNGs ──────────────────────")
    results = generate_all()
    print(f"\n   Generated: {len(results)} files")
    
    # Step 2: Verify transparency
    print("\n── Step 2: Verifying transparency ───────────────")
    ok = True
    for r in results:
        if r['transparent'] and r['mode'] != 'RGBA':
            print(f"  ✗ {r['slot']}: expected RGBA but got {r['mode']}")
            ok = False
    if ok:
        print("  ✓ All transparent assets have RGBA mode")
    
    # Step 3: Upload & register
    print("\n── Step 3: Uploading to Supabase ─────────────────")
    upload_result = upload_and_register(results, theme_key)
    
    if upload_result:
        uploaded, registered = upload_result
        total = len(results)
        print(f"\n══════════════════════════════════════════════════")
        print(f"  📊 Report:")
        print(f"     Generated:  {total} files")
        print(f"     Uploaded:   {uploaded}/{total}")
        print(f"     Registered: {registered}/{total}")
        print(f"     Skipped:    music (MP3)")
        print(f"══════════════════════════════════════════════════")
        print(f"\n🎉 Done! Refresh /dashboard/themes/{theme_key}/assets")

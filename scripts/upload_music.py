#!/usr/bin/env python3
"""
upload_music.py
---------------
Batch download romantic/wedding music from Mixkit
and upload to Supabase Storage bucket 'music'.

Usage:
    pip install requests supabase
    python scripts/upload_music.py

Fill in SUPABASE_URL and SUPABASE_SERVICE_KEY below.
"""

import os
import requests
import json
import time

# ============================================================
# CONFIG — isi sesuai project Supabase kamu
# ============================================================
SUPABASE_URL = "https://XXXX.supabase.co"          # ganti XXXX
SUPABASE_SERVICE_KEY = "eyJ..."                    # service_role key (bukan anon)
BUCKET_NAME = "music"
# ============================================================

# Daftar lagu Mixkit — wedding & romantic, bebas royalti
# Format: (filename_di_storage, url_download, display_title, genre, emoji)
TRACKS = [
    (
        "mixkit-dreamy-nature-ambiance.mp3",
        "https://assets.mixkit.co/music/download/mixkit-dreamy-nature-ambiance-5027.mp3",
        "Dreamy Nature",
        "Ambient \u00b7 Dreamy",
        "\u2728",
    ),
    (
        "mixkit-serene-view-443.mp3",
        "https://assets.mixkit.co/music/download/mixkit-serene-view-443.mp3",
        "Serene View",
        "Cinematic \u00b7 Calm",
        "\ud83c\udf05",
    ),
    (
        "mixkit-sweet-romance-668.mp3",
        "https://assets.mixkit.co/music/download/mixkit-sweet-romance-668.mp3",
        "Sweet Romance",
        "Piano \u00b7 Romantic",
        "\u2764\ufe0f",
    ),
    (
        "mixkit-romantic-moment-583.mp3",
        "https://assets.mixkit.co/music/download/mixkit-romantic-moment-583.mp3",
        "Romantic Moment",
        "Orkestra \u00b7 Emotional",
        "\ud83c\udf39",
    ),
    (
        "mixkit-when-i-close-my-eyes-668.mp3",
        "https://assets.mixkit.co/music/download/mixkit-when-i-close-my-eyes-668.mp3",
        "When I Close My Eyes",
        "Piano \u00b7 Nostalgic",
        "\ud83c\udf19",
    ),
    (
        "mixkit-beauty-of-annihilation-piano-remastered-8060.mp3",
        "https://assets.mixkit.co/music/download/mixkit-beauty-of-annihilation-piano-remastered-8060.mp3",
        "Beauty of Annihilation",
        "Piano \u00b7 Melancholic",
        "\ud83c\udfb9",
    ),
    (
        "mixkit-soft-winds-of-love-633.mp3",
        "https://assets.mixkit.co/music/download/mixkit-soft-winds-of-love-633.mp3",
        "Soft Winds of Love",
        "Acoustic \u00b7 Warm",
        "\ud83c\udf38",
    ),
    (
        "mixkit-a-very-happy-christmas-897.mp3",
        "https://assets.mixkit.co/music/download/mixkit-blissful-life-740.mp3",
        "Blissful Life",
        "Acoustic \u00b7 Uplifting",
        "\u2600\ufe0f",
    ),
    (
        "mixkit-love-in-the-fall-432.mp3",
        "https://assets.mixkit.co/music/download/mixkit-love-in-the-fall-432.mp3",
        "Love in the Fall",
        "Cinematic \u00b7 Hopeful",
        "\ud83c\udf42",
    ),
    (
        "mixkit-valley-sunset-127.mp3",
        "https://assets.mixkit.co/music/download/mixkit-valley-sunset-127.mp3",
        "Valley Sunset",
        "Ambient \u00b7 Peaceful",
        "\ud83c\udf04",
    ),
]


def create_bucket_if_not_exists():
    """Create public bucket 'music' if it doesn't exist yet."""
    url = f"{SUPABASE_URL}/storage/v1/bucket"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }
    payload = {"id": BUCKET_NAME, "name": BUCKET_NAME, "public": True}
    res = requests.post(url, headers=headers, json=payload)
    if res.status_code in (200, 201):
        print(f"\u2705 Bucket '{BUCKET_NAME}' created.")
    elif res.status_code == 409:
        print(f"\u2139\ufe0f  Bucket '{BUCKET_NAME}' already exists.")
    else:
        print(f"\u26a0\ufe0f  Bucket create response: {res.status_code} {res.text}")


def download_file(url: str, filename: str) -> bytes | None:
    """Download file from URL, return bytes or None on failure."""
    print(f"  \u2193 Downloading {filename} ...", end=" ", flush=True)
    try:
        res = requests.get(url, timeout=30, headers={"User-Agent": "Mozilla/5.0"})
        if res.status_code == 200:
            print(f"OK ({len(res.content) // 1024} KB)")
            return res.content
        else:
            print(f"FAILED ({res.status_code})")
            return None
    except Exception as e:
        print(f"ERROR: {e}")
        return None


def upload_to_supabase(filename: str, data: bytes) -> str | None:
    """Upload bytes to Supabase Storage, return public URL or None."""
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{filename}"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "audio/mpeg",
        "x-upsert": "true",  # overwrite if exists
    }
    print(f"  \u2191 Uploading {filename} ...", end=" ", flush=True)
    res = requests.post(url, headers=headers, data=data)
    if res.status_code in (200, 201):
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{filename}"
        print(f"OK")
        return public_url
    else:
        print(f"FAILED ({res.status_code} {res.text})")
        return None


def main():
    print("\n\ud83c\udfb5 Wedding Music Uploader for Supabase Storage")
    print("=" * 50)

    if "XXXX" in SUPABASE_URL or "eyJ..." in SUPABASE_SERVICE_KEY:
        print("\n\u274c ERROR: Isi dulu SUPABASE_URL dan SUPABASE_SERVICE_KEY di bagian CONFIG!")
        return

    create_bucket_if_not_exists()
    print()

    results = []  # list of (id, title, genre, emoji, public_url, duration)

    for filename, dl_url, title, genre, emoji in TRACKS:
        print(f"\ud83c\udfb6 {title}")
        data = download_file(dl_url, filename)
        if data is None:
            print(f"  \u23ed\ufe0f  Skipped.\n")
            continue

        public_url = upload_to_supabase(filename, data)
        if public_url:
            track_id = filename.replace(".mp3", "").replace(" ", "-")
            results.append({
                "id": track_id,
                "title": title,
                "artist": "Mixkit",
                "genre": genre,
                "duration": "~3 min",
                "url": public_url,
                "coverEmoji": emoji,
            })
        print()
        time.sleep(0.5)  # be nice to the CDN

    # Output hasil sebagai TypeScript array
    print("\n" + "=" * 50)
    print("\u2705 SELESAI! Copy paste hasil berikut ke src/data/weddingMusic.ts:\n")
    print("export const WEDDING_MUSIC: WeddingTrack[] = [")
    for t in results:
        print(f"    {{")
        print(f"        id: '{t['id']}',")
        print(f"        title: '{t['title']}',")
        print(f"        artist: '{t['artist']}',")
        print(f"        genre: '{t['genre']}',")
        print(f"        duration: '{t['duration']}',")
        print(f"        url: '{t['url']}',")
        print(f"        coverEmoji: '{t['coverEmoji']}',")
        print(f"    }},")
    print("];")

    # Simpan juga ke file JSON untuk referensi
    with open("scripts/music_urls_output.json", "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print("\n\ud83d\udcbe Hasil juga disimpan di scripts/music_urls_output.json")
    print("\nKirimkan isi file JSON tersebut ke AI untuk update weddingMusic.ts otomatis!")


if __name__ == "__main__":
    main()

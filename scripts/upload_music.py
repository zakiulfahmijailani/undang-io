#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
upload_music.py
---------------
Batch download romantic/wedding music from Mixkit
and upload to Supabase Storage bucket 'music'.

Usage:
    pip install requests
    python scripts/upload_music.py

Fill in SUPABASE_URL and SUPABASE_SERVICE_KEY below.
"""

import sys
import requests
import json
import time

# Fix Windows terminal Unicode issue
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# ============================================================
# CONFIG - isi sesuai project Supabase kamu
# ============================================================
SUPABASE_URL = "https://XXXX.supabase.co"          # ganti XXXX
SUPABASE_SERVICE_KEY = "eyJ..."                    # service_role key (bukan anon)
BUCKET_NAME = "music"
# ============================================================

# Format: (filename_di_storage, url_download, display_title, genre, emoji)
TRACKS = [
    (
        "mixkit-dreamy-nature-ambiance.mp3",
        "https://assets.mixkit.co/music/download/mixkit-dreamy-nature-ambiance-5027.mp3",
        "Dreamy Nature",
        "Ambient · Dreamy",
        "✨",
    ),
    (
        "mixkit-serene-view-443.mp3",
        "https://assets.mixkit.co/music/download/mixkit-serene-view-443.mp3",
        "Serene View",
        "Cinematic · Calm",
        "🌅",
    ),
    (
        "mixkit-sweet-romance-668.mp3",
        "https://assets.mixkit.co/music/download/mixkit-sweet-romance-668.mp3",
        "Sweet Romance",
        "Piano · Romantic",
        "❤️",
    ),
    (
        "mixkit-romantic-moment-583.mp3",
        "https://assets.mixkit.co/music/download/mixkit-romantic-moment-583.mp3",
        "Romantic Moment",
        "Orkestra · Emotional",
        "🌹",
    ),
    (
        "mixkit-when-i-close-my-eyes-668.mp3",
        "https://assets.mixkit.co/music/download/mixkit-when-i-close-my-eyes-668.mp3",
        "When I Close My Eyes",
        "Piano · Nostalgic",
        "🌙",
    ),
    (
        "mixkit-beauty-of-annihilation-piano-remastered-8060.mp3",
        "https://assets.mixkit.co/music/download/mixkit-beauty-of-annihilation-piano-remastered-8060.mp3",
        "Beauty of Annihilation",
        "Piano · Melancholic",
        "🎹",
    ),
    (
        "mixkit-soft-winds-of-love-633.mp3",
        "https://assets.mixkit.co/music/download/mixkit-soft-winds-of-love-633.mp3",
        "Soft Winds of Love",
        "Acoustic · Warm",
        "🌸",
    ),
    (
        "mixkit-blissful-life-740.mp3",
        "https://assets.mixkit.co/music/download/mixkit-blissful-life-740.mp3",
        "Blissful Life",
        "Acoustic · Uplifting",
        "☀️",
    ),
    (
        "mixkit-love-in-the-fall-432.mp3",
        "https://assets.mixkit.co/music/download/mixkit-love-in-the-fall-432.mp3",
        "Love in the Fall",
        "Cinematic · Hopeful",
        "🍂",
    ),
    (
        "mixkit-valley-sunset-127.mp3",
        "https://assets.mixkit.co/music/download/mixkit-valley-sunset-127.mp3",
        "Valley Sunset",
        "Ambient · Peaceful",
        "🌄",
    ),
]


def create_bucket_if_not_exists():
    url = f"{SUPABASE_URL}/storage/v1/bucket"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }
    payload = {"id": BUCKET_NAME, "name": BUCKET_NAME, "public": True}
    res = requests.post(url, headers=headers, json=payload)
    if res.status_code in (200, 201):
        print(f"[OK] Bucket '{BUCKET_NAME}' created.")
    elif res.status_code == 409:
        print(f"[INFO] Bucket '{BUCKET_NAME}' already exists.")
    else:
        print(f"[WARN] Bucket create response: {res.status_code} {res.text}")


def download_file(url: str, filename: str):
    print(f"  [DL] Downloading {filename} ...", end=" ", flush=True)
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


def upload_to_supabase(filename: str, data: bytes):
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{filename}"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "audio/mpeg",
        "x-upsert": "true",
    }
    print(f"  [UP] Uploading {filename} ...", end=" ", flush=True)
    res = requests.post(url, headers=headers, data=data)
    if res.status_code in (200, 201):
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{filename}"
        print("OK")
        return public_url
    else:
        print(f"FAILED ({res.status_code} {res.text})")
        return None


def main():
    print("\n=== Wedding Music Uploader for Supabase Storage ===")
    print("=" * 50)

    if "XXXX" in SUPABASE_URL or "eyJ..." in SUPABASE_SERVICE_KEY:
        print("\n[ERROR] Isi dulu SUPABASE_URL dan SUPABASE_SERVICE_KEY di bagian CONFIG!")
        return

    create_bucket_if_not_exists()
    print()

    results = []

    for filename, dl_url, title, genre, emoji in TRACKS:
        print(f"[TRACK] {title}")
        data = download_file(dl_url, filename)
        if data is None:
            print("  [SKIP] Skipped.\n")
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
        time.sleep(0.5)

    print("\n" + "=" * 50)
    print("[DONE] Selesai! Hasil disimpan di scripts/music_urls_output.json")
    print("Kirimkan isi file JSON tersebut ke AI untuk update weddingMusic.ts!\n")

    with open("scripts/music_urls_output.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    # Preview output
    print("Preview URL yang berhasil diupload:")
    for t in results:
        print(f"  - {t['title']}: {t['url']}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
upload_music.py
---------------
Upload local MP3 files to Supabase Storage bucket 'music'.

Usage:
    1. Taruh file MP3 ke folder: scripts/music/
    2. Isi SUPABASE_URL dan SUPABASE_SERVICE_KEY di bagian CONFIG
    3. Jalankan: python scripts/upload_music.py

Requirements:
    pip install requests
"""

import sys
import os
import requests
import json
import time

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# ============================================================
# CONFIG - isi sesuai project Supabase kamu
# ============================================================
SUPABASE_URL = "https://zbhjomuenjacoepwpiyw.supabase.co"          # ganti XXXX
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiaGpvbXVlbmphY29lcHdwaXl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ4ODQ1MCwiZXhwIjoyMDg5MDY0NDUwfQ.HyU0FrooJbZwfbggtKQrIX0K_ybxtTIshJSEFc9Jtsk"                     # service_role key (bukan anon)
BUCKET_NAME = "music"
MUSIC_FOLDER = os.path.join(os.path.dirname(__file__), "music")
# ============================================================

# Mapping nama file -> metadata (title, genre, emoji)
# Kalau nama file tidak ada di sini, akan pakai nama file sebagai title
TRACK_METADATA = {
    "dreamy-nature.mp3":        ("Dreamy Nature",        "Ambient · Dreamy",      "✨"),
    "serene-view.mp3":          ("Serene View",           "Cinematic · Calm",      "🌅"),
    "sweet-romance.mp3":        ("Sweet Romance",         "Piano · Romantic",      "❤️"),
    "romantic-moment.mp3":      ("Romantic Moment",       "Orkestra · Emotional",  "🌹"),
    "when-i-close-my-eyes.mp3": ("When I Close My Eyes",  "Piano · Nostalgic",     "🌙"),
    "beauty-annihilation.mp3":  ("Beauty of Annihilation","Piano · Melancholic",   "🎹"),
    "soft-winds-of-love.mp3":   ("Soft Winds of Love",    "Acoustic · Warm",       "🌸"),
    "blissful-life.mp3":        ("Blissful Life",          "Acoustic · Uplifting",  "☀️"),
    "love-in-the-fall.mp3":     ("Love in the Fall",       "Cinematic · Hopeful",   "🍂"),
    "valley-sunset.mp3":        ("Valley Sunset",          "Ambient · Peaceful",    "🌄"),
}


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

    # Cek folder music/
    if not os.path.isdir(MUSIC_FOLDER):
        print(f"\n[ERROR] Folder tidak ditemukan: {MUSIC_FOLDER}")
        print("Buat folder 'scripts/music/' dan taruh file MP3 di sana.")
        return

    mp3_files = sorted([f for f in os.listdir(MUSIC_FOLDER) if f.lower().endswith(".mp3")])
    if not mp3_files:
        print(f"\n[ERROR] Tidak ada file .mp3 di folder: {MUSIC_FOLDER}")
        print("Download lagu dari https://mixkit.co/free-stock-music/tag/wedding/")
        print("lalu taruh di folder scripts/music/")
        return

    print(f"\n[INFO] Ditemukan {len(mp3_files)} file MP3 di scripts/music/")
    create_bucket_if_not_exists()
    print()

    results = []

    for filename in mp3_files:
        filepath = os.path.join(MUSIC_FOLDER, filename)
        size_kb = os.path.getsize(filepath) // 1024

        # Ambil metadata, fallback ke nama file
        if filename in TRACK_METADATA:
            title, genre, emoji = TRACK_METADATA[filename]
        else:
            title = filename.replace(".mp3", "").replace("-", " ").title()
            genre = "Music"
            emoji = "🎵"

        print(f"[TRACK] {title} ({size_kb} KB)")
        with open(filepath, "rb") as f:
            data = f.read()

        public_url = upload_to_supabase(filename, data)
        if public_url:
            track_id = filename.replace(".mp3", "")
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
        time.sleep(0.3)

    print("=" * 50)

    if not results:
        print("[WARN] Tidak ada file yang berhasil diupload.")
        return

    # Simpan JSON
    output_path = os.path.join(os.path.dirname(__file__), "music_urls_output.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"[DONE] {len(results)}/{len(mp3_files)} lagu berhasil diupload!")
    print(f"[SAVE] Hasil disimpan di scripts/music_urls_output.json")
    print("\nKirimkan isi file JSON tersebut ke AI untuk update weddingMusic.ts!\n")

    print("Preview URL:")
    for t in results:
        print(f"  - {t['title']}: {t['url']}")


if __name__ == "__main__":
    main()

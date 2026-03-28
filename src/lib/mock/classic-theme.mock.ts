/**
 * Mock ClassicTheme untuk preview & development.
 * Semua aset visual menggunakan Picsum Photos (placeholder).
 * Ornamen & bunga sengaja null — komponen fallback gracefully.
 */
import type { ClassicTheme } from "@/types/theme";

// Picsum placeholder untuk bg landscape
const PH = (w: number, h: number, seed: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const mockClassicTheme: ClassicTheme = {
  id:               "mock-classic-rehan-001",
  slug:             "classic-rehan",
  name:             "Classic Rehan",
  description:      "Tema klasik elegan terinspirasi dari template Rehan Maulidan. Dominan warna gold dengan dekorasi floral.",
  thumbnail_url:    PH(400, 600, 10),
  is_published:     true,
  cultural_category: "modern",
  target_event:     "wedding",
  tags:             ["klasik", "gold", "floral", "islami", "modern"],
  created_by:       null,
  created_at:       "2026-03-28T00:00:00+07:00",
  updated_at:       "2026-03-28T00:00:00+07:00",

  assets: {
    // ── A. Backgrounds ─────────────────────────────────────────
    bg_cover:     PH(1200, 800, 11),
    bg_section_2: PH(1200, 800, 12),
    bg_section_3: PH(1200, 800, 13),
    bg_section_4: PH(1200, 800, 14),
    bg_section_5: PH(1200, 800, 15),
    bg_groom_panel: null,

    // ── A. Ornaments ────────────────────────────────────────────
    // Semua null — komponen fallback ke CSS/text
    ornament_half_circle: null,
    ornament_overlay:     null,
    ornament_bismillah:   null,
    ornament_divider:     null,
    ornament_corner_tl:   null,
    ornament_corner_br:   null,

    // ── B. Flower slots ───────────────────────────────────────────
    // Null — dalam produksi diisi PNG bunga dari admin upload
    flower_top_right_url:    null,
    flower_top_left_url:     null,
    flower_bottom_right_url: null,
    flower_bottom_left_url:  null,
    flower_right_url:        null,
    flower_left_url:         null,
    flower_top_center_url:   null,

    // ── C. Section overrides ──────────────────────────────────────
    couple_main_image_url: PH(400, 400, 20),
    cover_bg_color:        "#faf5ef",
    cover_bg_pattern_url:  null,
    hero_bg_color:         "#fdfaf6",
    hero_bg_pattern_url:   null,
    bismillah_image_url:   null,          // fallback → teks Arab Unicode
    couple_bg_color:       "#fdfaf6",
    couple_bg_pattern_url: null,
    event_bg_color:        "#faf6f0",
    event_card_bg_color:   "#fffdf9",
    event_divider_image_url: null,        // fallback → garis tipis

    // ── D. Particles ─────────────────────────────────────────────
    particle_type:  "petals",
    particle_color: null,   // null → ikut color_primary

    // ── D. Palette ───────────────────────────────────────────────
    color_primary:     "#8b6c42",   // Gold tua — heading, border, aksen
    color_secondary:   "#f5ede0",   // Krem muda — bg ringan, placeholder
    color_text_muted:  "#9a8060",   // Abu-abu hangat — teks sub
    color_accent:      "#c9a97a",   // Gold muda — CTA, hover
    color_bg_page:     "#fdfaf6",   // Off-white warm — bg halaman
    color_text_body:   "#3d2e1e",   // Coklat gelap — teks isi
    color_overlay:     "#00000030", // Overlay tipis di atas hero bg

    // ── D. Typography ────────────────────────────────────────────
    font_display: "Cormorant Garamond", // Nama mempelai, heading utama (serif elegant)
    font_body:    "Didact Gothic",       // Teks isi, alamat, label
    font_script:  "Sacramento",          // Sub-heading cursive (The Wedding Of, Save The Date)
    font_heading: "Oswald",              // Judul ALL-CAPS di event card
    font_arabic:  "Scheherazade New",    // Teks Arab fallback bismillah

    // ── A. Audio & animation ─────────────────────────────────────
    bg_music:     null,   // null → tidak ada musik di preview
    loader_asset: null,
  },
};

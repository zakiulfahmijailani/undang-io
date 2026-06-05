/* Static landing content and fallbacks for the Landing Page undang-io mockup. */

import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  Clock3,
  Eye,
  Link2,
  MessageSquareText,
  Music2,
  Palette,
  Share2,
  Sparkles,
  Timer,
  WalletCards,
} from "lucide-react";
import type { LandingTheme } from "./types";
import {
  DEFAULT_INVITATION_THEME_KEY,
  DEFAULT_INVITATION_THEME_NAME,
  DEFAULT_INVITATION_THEME_CATEGORY,
  JAWA_AGUNG_THEME_CATEGORY,
  JAWA_AGUNG_THEME_KEY,
  JAWA_AGUNG_THEME_NAME,
  OBSIDIAN_LUXE_THEME_CATEGORY,
  OBSIDIAN_LUXE_THEME_KEY,
  OBSIDIAN_LUXE_THEME_NAME,
  PETAL_SOFT_THEME_CATEGORY,
  PETAL_SOFT_THEME_KEY,
  PETAL_SOFT_THEME_NAME,
} from "@/lib/default-theme";

export const fallbackThemes: LandingTheme[] = [
  {
    id: DEFAULT_INVITATION_THEME_KEY,
    name: DEFAULT_INVITATION_THEME_NAME,
    slug: DEFAULT_INVITATION_THEME_KEY,
    thumbnailUrl: null,
    culturalCategory: DEFAULT_INVITATION_THEME_CATEGORY,
  },
  {
    id: PETAL_SOFT_THEME_KEY,
    name: PETAL_SOFT_THEME_NAME,
    slug: PETAL_SOFT_THEME_KEY,
    thumbnailUrl: null,
    culturalCategory: PETAL_SOFT_THEME_CATEGORY,
  },
  {
    id: OBSIDIAN_LUXE_THEME_KEY,
    name: OBSIDIAN_LUXE_THEME_NAME,
    slug: OBSIDIAN_LUXE_THEME_KEY,
    thumbnailUrl: null,
    culturalCategory: OBSIDIAN_LUXE_THEME_CATEGORY,
  },
  {
    id: JAWA_AGUNG_THEME_KEY,
    name: JAWA_AGUNG_THEME_NAME,
    slug: JAWA_AGUNG_THEME_KEY,
    thumbnailUrl: "/themes/jawa-agung/hero-ornament.webp",
    culturalCategory: JAWA_AGUNG_THEME_CATEGORY,
  },
];

export type LandingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const heroBenefits: LandingFeature[] = [
  {
    title: "Super Cepat",
    description: "Buat undangan siap dibagikan dalam 5 menit.",
    icon: Timer,
  },
  {
    title: "Hemat Biaya",
    description: "Tanpa biaya cetak, tanpa ongkir, hemat untuk semua tamu.",
    icon: WalletCards,
  },
  {
    title: "Mudah Dibagikan",
    description: "Satu link untuk WhatsApp, Instagram, dan keluarga.",
    icon: Share2,
  },
];

export const features: LandingFeature[] = [
  {
    title: "Live Preview",
    description: "Lihat hasil undangan real-time saat kamu mengisi data.",
    icon: Eye,
  },
  {
    title: "50+ Tema Premium",
    description: "Dari minimalis modern hingga tradisional Jawa.",
    icon: Palette,
  },
  {
    title: "Bagikan via Link",
    description: "Satu link untuk semua tamu, bisa dibuka kapan pun.",
    icon: Link2,
  },
  {
    title: "RSVP Digital",
    description: "Tamu konfirmasi kehadiran langsung dari undangan.",
    icon: ClipboardCheck,
  },
  {
    title: "Musik & Animasi",
    description: "Tambahkan sentuhan personal dengan musik dan gerak halus.",
    icon: Music2,
  },
];

export const testimonials = [
  {
    quote: "Undangan kami jadi super elegan dan tamu-tamu pada suka banget. Mudah dibuatnya juga.",
    name: "Dinda & Yoga",
    detail: "Menikah, 03.05.2025",
  },
  {
    quote: "Fitur RSVP-nya membantu banget buat ngatur jumlah tamu. Praktis dan kelihatan premium.",
    name: "Salma & Fikri",
    detail: "Menikah, 21.06.2025",
  },
  {
    quote: "Banyak pilihan tema yang cantik, dan prosesnya cepat. Recommended untuk calon pengantin.",
    name: "Nabila & Arif",
    detail: "Menikah, 17.08.2025",
  },
] as const;

export const pricingBullets = {
  free: ["Preview undangan 25 menit", "1 tema pilihan", "Tanpa RSVP"],
  premium: ["Undangan permanen", "Semua tema premium", "RSVP digital", "Musik latar & animasi", "Prioritas support"],
} as const;

export const quickFacts = [
  { label: "Dipercaya oleh", value: "10.000+ pasangan" },
  { label: "Koleksi tema", value: "50+ tema premium" },
  { label: "Kirim ke", value: "WhatsApp & Instagram" },
] as const;

export const microFeatures = [
  {
    title: "Tanpa ribet",
    description: "Isi data, pilih tema, dan langsung bagikan.",
    icon: Sparkles,
  },
  {
    title: "Waktu fleksibel",
    description: "Mulai gratis 25 menit, upgrade saat siap.",
    icon: Clock3,
  },
  {
    title: "Tamu terdata",
    description: "Ucapan dan konfirmasi tamu tersimpan rapi.",
    icon: MessageSquareText,
  },
] as const;

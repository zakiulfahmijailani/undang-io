/**
 * Mock ClassicInvitationData untuk preview & development.
 * Dummy data pasangan Rehan & Maulida — terinspirasi dari template asli.
 */
import type { ClassicInvitationData } from "@/types/theme";

// Picsum placeholder untuk foto
const PH = (w: number, h: number, seed: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const mockInvitationData: ClassicInvitationData = {
  // ── Foto mempelai ────────────────────────────────────────────
  groom_photo_url: PH(400, 400, 30),
  bride_photo_url: PH(400, 400, 31),
  photo_couple_1:  PH(1200, 800, 32),
  photo_couple_2:  PH(800, 800, 33),
  photo_couple_3:  PH(800, 800, 34),
  photo_gallery: [
    PH(600, 600, 35),
    PH(600, 600, 36),
    PH(600, 600, 37),
    PH(600, 600, 38),
    PH(600, 600, 39),
    PH(600, 600, 40),
  ],

  // ── Nama mempelai ────────────────────────────────────────────
  groom_full_name: "Rayhan Maulidan, S.T.",
  bride_full_name: "Maulida Rahmawati, S.Pd.",
  groom_nickname:  "Rehan",
  bride_nickname:  "Maulida",
  name_groom_short: "Rehan",
  name_bride_short: "Maulida",

  // ── Data orang tua ───────────────────────────────────────────
  groom_father_name: "Bapak H. Maulana Yusuf",
  groom_mother_name: "Ibu Hj. Siti Rahmah",
  groom_child_order: "Putra Pertama",
  bride_father_name: "Bapak Ir. Rahmat Hidayat",
  bride_mother_name: "Ibu Dra. Nurhayati",
  bride_child_order: "Putri Kedua",

  // ── Bio ────────────────────────────────────────────────────
  bio_groom: "Sarjana Teknik Informatika · Software Engineer · Coffee lover ☕",
  bio_bride: "Sarjana Pendidikan · Guru SD · Pecinta kucing 🐈",

  // ── Data acara ───────────────────────────────────────────────
  // Tanggal: 12 Juli 2026
  akad_datetime:    "2026-07-12T08:00:00+07:00",
  resepsi_datetime: "2026-07-12T11:00:00+07:00",

  akad_location_name:    "Masjid Al-Ikhlas Padang",
  akad_location_address: "Jl. Veteran No. 123, Padang Barat, Kota Padang, Sumatera Barat 25111",
  akad_maps_url:         "https://maps.google.com/?q=Masjid+Al-Ikhlas+Padang",

  resepsi_location_name:    "Grand Inna Padang",
  resepsi_location_address: "Jl. Gereja No. 28, Padang Barat, Kota Padang, Sumatera Barat 25116",
  resepsi_maps_url:         "https://maps.google.com/?q=Grand+Inna+Padang",

  // ── Love story ──────────────────────────────────────────────
  love_story: [
    {
      date:  "Agustus 2021",
      title: "Pertama Bertemu",
      description:
        "Kami pertama bertemu di seminar teknologi di Universitas Andalas. Satu senyum yang mengubah segalanya.",
    },
    {
      date:  "Februari 2022",
      title: "Kenalan Lebih Dekat",
      description:
        "Takdir mempertemukan kami lagi di sebuah kafe kecil di Bukittinggi. Obrolan yang tak kunjung habis.",
    },
    {
      date:  "Desember 2023",
      title: "Lamaran",
      description:
        "Di tepi Pantai Air Manis, dengan latar Gunung Padang, Rehan berlutut dan Maulida pun berkata iya.",
    },
    {
      date:  "12 Juli 2026",
      title: "Hari Bahagia",
      description:
        "Akhirnya kami melangkah ke jenjang yang lebih suci. Terima kasih telah menjadi bagian dari perjalanan kami.",
    },
  ],

  // ── Amplop digital ───────────────────────────────────────────
  qris_image: null,
  rekening: [
    {
      bank:           "BCA",
      account_name:   "Rayhan Maulidan",
      account_number: "1234567890",
    },
    {
      bank:           "GoPay",
      account_name:   "Rayhan Maulidan",
      account_number: "081234567890",
    },
  ],
};

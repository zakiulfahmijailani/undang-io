import { demoData } from "@/data/demoInvitation";
import { mapInvitationToFatehaData } from "@/lib/fateha-theme-mapper";
import { DEFAULT_INVITATION_THEME_KEY, OBSIDIAN_LUXE_THEME_KEY, PETAL_SOFT_THEME_KEY } from "@/lib/default-theme";
import { LiveDemoWrapper } from "./LiveDemoWrapper";

type InviteDemoPageProps = {
  searchParams: Promise<{ theme?: string }>;
};

function createSakinahDemoData() {
  return mapInvitationToFatehaData(
    {
      id: "demo",
      slug: "demo",
      groom_full_name: demoData.groom.fullName,
      groom_nickname: "Budi",
      groom_father_name: demoData.groom.father,
      groom_mother_name: demoData.groom.mother,
      bride_full_name: demoData.bride.fullName,
      bride_nickname: "Ayu",
      bride_father_name: demoData.bride.father,
      bride_mother_name: demoData.bride.mother,
      akad_datetime: demoData.akad.date,
      akad_location_name: demoData.akad.venue,
      akad_location_address: demoData.akad.address,
      akad_maps_url: demoData.akad.mapsUrl,
      resepsi_datetime: demoData.reception.date,
      resepsi_location_name: demoData.reception.venue,
      resepsi_location_address: demoData.reception.address,
      resepsi_maps_url: demoData.reception.mapsUrl,
      quote_text: demoData.quote.text,
      quote_source: demoData.quote.source,
      love_story: demoData.loveStory,
      gallery_photos: demoData.gallery,
      rekening: demoData.bankAccounts,
      gift_shipping_address: demoData.giftAddress,
      rsvp_messages: demoData.rsvpMessages.map((message) => ({
        id: message.id,
        guest_name: message.guestName,
        attendance: message.attendance,
        message: message.message,
        created_at: message.createdAt,
      })),
    },
    { isPreview: true },
  );
}

function createPetalSoftDemoData() {
  return mapInvitationToFatehaData(
    {
      id: "demo-petal-soft",
      slug: "demo-petal-soft",
      groom_full_name: "Muhammad Rizki Pratama",
      groom_nickname: "Rizki",
      groom_father_name: "Bapak Lorem",
      groom_mother_name: "Ibu Ipsum",
      bride_full_name: "Nazwa Aurelia Putri",
      bride_nickname: "Nazwa",
      bride_father_name: "Bapak Dolor",
      bride_mother_name: "Ibu Sit Amet",
      akad_datetime: "2025-10-12T08:00:00+07:00",
      akad_location_name: "Masjid Al-Ikhlas",
      akad_location_address: "Jl. Damai No. 10, Bandung, Jawa Barat",
      akad_maps_url: demoData.akad.mapsUrl,
      resepsi_datetime: "2025-10-12T11:00:00+07:00",
      resepsi_location_name: "Gedung Harmoni",
      resepsi_location_address: "Jl. Bahagia No. 20, Bandung, Jawa Barat",
      resepsi_maps_url: demoData.reception.mapsUrl,
      quote_text: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri agar kamu merasa tenteram kepadanya.",
      quote_source: "QS. Ar-Rum: 21",
      love_story: demoData.loveStory,
      gallery_photos: demoData.gallery,
      rekening: demoData.bankAccounts,
      gift_shipping_address: demoData.giftAddress,
      rsvp_messages: demoData.rsvpMessages.map((message) => ({
        id: message.id,
        guest_name: message.guestName,
        attendance: message.attendance,
        message: message.message,
        created_at: message.createdAt,
      })),
    },
    { isPreview: true },
  );
}

function createObsidianLuxeDemoData() {
  return mapInvitationToFatehaData(
    {
      id: "demo-obsidian-luxe",
      slug: "demo-obsidian-luxe",
      groom_full_name: "Rafi Narendra",
      groom_nickname: "Rafi",
      groom_father_name: "Bapak Arman",
      groom_mother_name: "Ibu Lestari",
      bride_full_name: "Adelia Maharani",
      bride_nickname: "Adelia",
      bride_father_name: "Bapak Surya",
      bride_mother_name: "Ibu Kirana",
      akad_datetime: "2026-02-14T10:00:00+07:00",
      akad_location_name: "The Dharmawangsa Ballroom",
      akad_location_address: "Jl. Brawijaya Raya No. 26, Jakarta Selatan",
      akad_maps_url: "https://maps.google.com/?q=The+Dharmawangsa+Jakarta",
      resepsi_datetime: "2026-02-14T19:00:00+07:00",
      resepsi_location_name: "Grand Ballroom Ritz-Carlton",
      resepsi_location_address: "Jl. DR. Ide Anak Agung Gde Agung, Jakarta Selatan",
      resepsi_maps_url: "https://maps.google.com/?q=Ritz+Carlton+Mega+Kuningan",
      quote_text: "Cinta adalah janji yang dipilih setiap hari, dengan hati yang sama dan doa yang semakin dalam.",
      quote_source: "Adelia & Rafi",
      love_story: demoData.loveStory,
      gallery_photos: demoData.gallery,
      rekening: demoData.bankAccounts,
      gift_shipping_address: demoData.giftAddress,
      rsvp_messages: demoData.rsvpMessages.map((message) => ({
        id: message.id,
        guest_name: message.guestName,
        attendance: message.attendance,
        message: message.message,
        created_at: message.createdAt,
      })),
    },
    { isPreview: true },
  );
}

export default async function InviteDemoPage({ searchParams }: InviteDemoPageProps) {
  const resolvedSearch = await searchParams;
  const theme = resolvedSearch.theme || DEFAULT_INVITATION_THEME_KEY;

  if (theme === "legacy") {
    return <LiveDemoWrapper initialData={demoData} theme={theme} />;
  }

  if (theme === PETAL_SOFT_THEME_KEY) {
    return <LiveDemoWrapper initialData={createPetalSoftDemoData()} theme={theme} />;
  }

  if (theme === OBSIDIAN_LUXE_THEME_KEY) {
    return <LiveDemoWrapper initialData={createObsidianLuxeDemoData()} theme={theme} />;
  }

  return <LiveDemoWrapper initialData={createSakinahDemoData()} theme={theme} />;
}

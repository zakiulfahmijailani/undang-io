import { demoData } from "@/data/demoInvitation";
import { mapInvitationToFatehaData } from "@/lib/fateha-theme-mapper";
import { DEFAULT_INVITATION_THEME_KEY, PETAL_SOFT_THEME_KEY } from "@/lib/default-theme";
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

export default async function InviteDemoPage({ searchParams }: InviteDemoPageProps) {
  const resolvedSearch = await searchParams;
  const theme = resolvedSearch.theme || DEFAULT_INVITATION_THEME_KEY;

  if (theme === "legacy") {
    return <LiveDemoWrapper initialData={demoData} theme={theme} />;
  }

  if (theme === PETAL_SOFT_THEME_KEY) {
    return <LiveDemoWrapper initialData={createPetalSoftDemoData()} theme={theme} />;
  }

  return <LiveDemoWrapper initialData={createSakinahDemoData()} theme={theme} />;
}

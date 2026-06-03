import { demoData } from "@/data/demoInvitation";
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";
import FatehaThemeRendererWrapper from "@/app/invite/[slug]/FatehaThemeRendererWrapper";
import { mapInvitationToFatehaData } from "@/lib/fateha-theme-mapper";

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

export default async function InviteDemoPage({ searchParams }: InviteDemoPageProps) {
  const resolvedSearch = await searchParams;

  if (resolvedSearch.theme === "legacy") {
    return <InvitationClientWrapper data={demoData} />;
  }

  return <FatehaThemeRendererWrapper data={createSakinahDemoData()} />;
}

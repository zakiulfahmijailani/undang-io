"use client";

import { useEffect, useState } from "react";
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";
import FatehaThemeRendererWrapper from "@/app/invite/[slug]/FatehaThemeRendererWrapper";
import { mapInvitationToFatehaData } from "@/lib/fateha-theme-mapper";
import { demoData as fallbackDemoData } from "@/data/demoInvitation";

export function LiveDemoWrapper({ initialData, theme }: { initialData: any, theme: string }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "UPDATE_PREVIEW") {
        const form = event.data.data;
        
        // Map the InvitationForm from buat-undangan-content to the expected structure
        // Since both legacy and fateha themes expect different data structures, we need to map them properly.
        // For Sakinah Serenity (Fateha), it maps from the db schema, so we create a mock db object.
        const mockDbInvitation = {
          id: "demo",
          slug: "demo",
          groom_full_name: form.groomFullName || "Mempelai Pria",
          groom_nickname: form.groomNickname || "Pria",
          groom_father_name: form.groomFather || "Ayah Pria",
          groom_mother_name: form.groomMother || "Ibu Pria",
          bride_full_name: form.brideFullName || "Mempelai Wanita",
          bride_nickname: form.brideNickname || "Wanita",
          bride_father_name: form.brideFather || "Ayah Wanita",
          bride_mother_name: form.brideMother || "Ibu Wanita",
          akad_datetime: form.akadDate ? `${form.akadDate}T${form.akadTime || "09:00"}:00Z` : null,
          akad_location_name: form.venue || "Lokasi Akad",
          akad_location_address: form.address || "Alamat Akad",
          akad_maps_url: form.mapsUrl || "",
          resepsi_datetime: form.receptionDate ? `${form.receptionDate}T${form.receptionTime || "19:00"}:00Z` : null,
          resepsi_location_name: form.venue || "Lokasi Resepsi",
          resepsi_location_address: form.address || "Alamat Resepsi",
          resepsi_maps_url: form.mapsUrl || "",
          quote_text: form.quote || "Kutipan",
          quote_source: "Mempelai",
          love_story: fallbackDemoData.loveStory,
          gallery_photos: fallbackDemoData.gallery,
          rekening: fallbackDemoData.bankAccounts,
          gift_shipping_address: fallbackDemoData.giftAddress,
          rsvp_messages: fallbackDemoData.rsvpMessages.map((message: any) => ({
            id: message.id,
            guest_name: message.guestName,
            attendance: message.attendance,
            message: message.message,
            created_at: message.createdAt,
          })),
        };

        if (theme === "legacy") {
            const legacyData = {
                ...fallbackDemoData,
                coupleShortName: `${form.groomNickname || "Pria"} & ${form.brideNickname || "Wanita"}`,
                groom: {
                    ...fallbackDemoData.groom,
                    fullName: form.groomFullName || "Mempelai Pria",
                    father: form.groomFather || "Ayah Pria",
                    mother: form.groomMother || "Ibu Pria",
                },
                bride: {
                    ...fallbackDemoData.bride,
                    fullName: form.brideFullName || "Mempelai Wanita",
                    father: form.brideFather || "Ayah Wanita",
                    mother: form.brideMother || "Ibu Wanita",
                },
                akad: {
                    ...fallbackDemoData.akad,
                    date: form.akadDate || "2025-12-12",
                    venue: form.venue || "Lokasi Akad",
                    address: form.address || "Alamat",
                },
                reception: {
                    ...fallbackDemoData.reception,
                    date: form.receptionDate || "2025-12-12",
                    venue: form.venue || "Lokasi Resepsi",
                    address: form.address || "Alamat",
                },
                quote: {
                    text: form.quote || fallbackDemoData.quote.text,
                    source: "Mempelai"
                }
            };
            setData(legacyData);
        } else {
            setData(mapInvitationToFatehaData(mockDbInvitation, { isPreview: true }));
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [theme]);

  if (theme === "legacy") {
    return <InvitationClientWrapper data={data} />;
  }

  return <FatehaThemeRendererWrapper data={data} />;
}

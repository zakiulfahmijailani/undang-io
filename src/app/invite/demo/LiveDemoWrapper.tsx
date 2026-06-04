"use client";

import { useEffect, useState } from "react";
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";
import FatehaThemeRendererWrapper from "@/app/invite/[slug]/FatehaThemeRendererWrapper";
import { JawaAgungTemplate } from "@/components/themes/jawa-agung";
import { ObsidianLuxeTemplate } from "@/components/themes/obsidian-luxe";
import { PetalSoftTemplate } from "@/components/themes/petal-soft";
import { mapInvitationToFatehaData } from "@/lib/fateha-theme-mapper";
import { JAWA_AGUNG_THEME_KEY, OBSIDIAN_LUXE_THEME_KEY, PETAL_SOFT_THEME_KEY } from "@/lib/default-theme";
import { demoData as fallbackDemoData } from "@/data/demoInvitation";
import type { FatehaInvitationData } from "@/components/themes/fateha";

type LegacyDemoData = typeof fallbackDemoData;
type LiveDemoData = LegacyDemoData | FatehaInvitationData;
type PreviewFormMessage = {
  type?: string;
  data?: {
    groomFullName?: string;
    groomNickname?: string;
    groomFather?: string;
    groomMother?: string;
    brideFullName?: string;
    brideNickname?: string;
    brideFather?: string;
    brideMother?: string;
    akadDate?: string;
    akadTime?: string;
    receptionDate?: string;
    receptionTime?: string;
    venue?: string;
    address?: string;
    mapsUrl?: string;
    quote?: string;
  };
};

export function LiveDemoWrapper({ initialData, theme }: { initialData: LiveDemoData; theme: string }) {
  const [data, setData] = useState<LiveDemoData>(initialData);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as PreviewFormMessage;
      if (message.type === "UPDATE_PREVIEW" && message.data) {
        const form = message.data;
        
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
          rsvp_messages: fallbackDemoData.rsvpMessages.map((message) => ({
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
    return <InvitationClientWrapper data={data as LegacyDemoData} />;
  }

  if (theme === PETAL_SOFT_THEME_KEY) {
    return <PetalSoftTemplate data={data as FatehaInvitationData} />;
  }

  if (theme === OBSIDIAN_LUXE_THEME_KEY) {
    return <ObsidianLuxeTemplate data={data as FatehaInvitationData} />;
  }

  if (theme === JAWA_AGUNG_THEME_KEY) {
    return <JawaAgungTemplate data={data as FatehaInvitationData} />;
  }

  return <FatehaThemeRendererWrapper data={data as FatehaInvitationData} />;
}

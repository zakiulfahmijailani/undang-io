"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";
import FatehaThemeRendererWrapper from "@/app/invite/[slug]/FatehaThemeRendererWrapper";
import { JawaAgungTemplate } from "@/components/themes/jawa-agung";
import { ObsidianLuxeTemplate } from "@/components/themes/obsidian-luxe";
import { PetalSoftTemplate } from "@/components/themes/petal-soft";
import { demoData as fallbackDemoData } from "@/data/demoInvitation";
import { DEFAULT_INVITATION_THEME_KEY, JAWA_AGUNG_THEME_KEY, OBSIDIAN_LUXE_THEME_KEY, PETAL_SOFT_THEME_KEY } from "@/lib/default-theme";
import { mapInvitationToFatehaData } from "@/lib/fateha-theme-mapper";
import type { FatehaInvitationData } from "@/components/themes/fateha";
import type { InvitationPreviewPayload, PreviewMessage, ThemePreviewOverride } from "@/types/preview";

type LegacyDemoData = typeof fallbackDemoData;
type LiveDemoData = LegacyDemoData | FatehaInvitationData;

function joinDateTime(date: string | undefined, time: string | undefined, fallback: string) {
  if (!date) return fallback;
  if (date.includes("T")) return date;
  return `${date}T${time || "09:00"}:00+07:00`;
}

function createPreviewRecord(form: InvitationPreviewPayload) {
  const groomNickname = form.groomNickname || "Rizky";
  const brideNickname = form.brideNickname || "Amara";

  return {
    id: form.id || "demo",
    slug: form.slug || "demo",
    groom_full_name: form.groomFullName || groomNickname,
    groom_nickname: groomNickname,
    groom_father_name: form.groomFather || fallbackDemoData.groom.father,
    groom_mother_name: form.groomMother || fallbackDemoData.groom.mother,
    groom_photo_url: form.groomPhotoUrl || fallbackDemoData.groom.photo,
    bride_full_name: form.brideFullName || brideNickname,
    bride_nickname: brideNickname,
    bride_father_name: form.brideFather || fallbackDemoData.bride.father,
    bride_mother_name: form.brideMother || fallbackDemoData.bride.mother,
    bride_photo_url: form.bridePhotoUrl || fallbackDemoData.bride.photo,
    couple_photo_url: form.couplePhotoUrl || fallbackDemoData.coverPhoto,
    background_photo_url: form.backgroundPhotoUrl || fallbackDemoData.heroPhoto,
    akad_datetime: joinDateTime(form.akadDate, form.akadTime, fallbackDemoData.akad.date),
    akad_time: form.akadTime,
    akad_location_name: form.akadVenue || form.venue || fallbackDemoData.akad.venue,
    akad_location_address: form.akadAddress || form.address || fallbackDemoData.akad.address,
    akad_maps_url: form.akadMapsUrl || form.mapsUrl || fallbackDemoData.akad.mapsUrl,
    resepsi_datetime: joinDateTime(form.receptionDate, form.receptionTime, fallbackDemoData.reception.date),
    reception_time: form.receptionTime,
    resepsi_location_name: form.receptionVenue || form.venue || fallbackDemoData.reception.venue,
    resepsi_location_address: form.receptionAddress || form.address || fallbackDemoData.reception.address,
    resepsi_maps_url: form.receptionMapsUrl || form.mapsUrl || fallbackDemoData.reception.mapsUrl,
    quote_text: form.quote || fallbackDemoData.quote.text,
    quote_source: form.quoteSource || fallbackDemoData.quote.source,
    quote_greeting: form.quoteGreeting,
    quote_arabic: form.quoteArabic,
    love_story: form.loveStory || fallbackDemoData.loveStory,
    gallery_photos: form.galleryPhotos || fallbackDemoData.gallery,
    gift_bank_name: form.giftBankName,
    gift_bank_account: form.giftBankAccount,
    gift_bank_account_name: form.giftBankAccountName,
    gift_shipping_address: form.giftShippingAddress || fallbackDemoData.giftAddress,
    rekening: form.giftBankName && form.giftBankAccount && form.giftBankAccountName
      ? [{ bank: form.giftBankName, number: form.giftBankAccount, name: form.giftBankAccountName }]
      : fallbackDemoData.bankAccounts,
    music_url: form.musicUrl,
    show_couple_photos: form.showCouplePhotos,
    show_prewed_gallery: form.showPrewedGallery,
    show_gift_section: form.showGiftSection,
    rsvp_enabled: form.rsvpEnabled,
    sections_order: form.sectionsOrder,
    sections_visibility: form.sectionsVisibility,
    rsvp_messages: fallbackDemoData.rsvpMessages.map((message) => ({
      id: message.id,
      guest_name: message.guestName,
      attendance: message.attendance,
      message: message.message,
      created_at: message.createdAt,
    })),
  };
}

function createLegacyData(form: InvitationPreviewPayload): LegacyDemoData {
  const groomNickname = form.groomNickname || "Rizky";
  const brideNickname = form.brideNickname || "Amara";

  return {
    ...fallbackDemoData,
    coupleShortName: `${groomNickname} & ${brideNickname}`,
    groom: {
      ...fallbackDemoData.groom,
      fullName: form.groomFullName || groomNickname,
      father: form.groomFather || fallbackDemoData.groom.father,
      mother: form.groomMother || fallbackDemoData.groom.mother,
      photo: form.groomPhotoUrl || fallbackDemoData.groom.photo,
    },
    bride: {
      ...fallbackDemoData.bride,
      fullName: form.brideFullName || brideNickname,
      father: form.brideFather || fallbackDemoData.bride.father,
      mother: form.brideMother || fallbackDemoData.bride.mother,
      photo: form.bridePhotoUrl || fallbackDemoData.bride.photo,
    },
    coverPhoto: form.couplePhotoUrl || fallbackDemoData.coverPhoto,
    heroPhoto: form.backgroundPhotoUrl || fallbackDemoData.heroPhoto,
    quote: {
      text: form.quote || fallbackDemoData.quote.text,
      source: form.quoteSource || fallbackDemoData.quote.source,
    },
    akad: {
      date: joinDateTime(form.akadDate, form.akadTime, fallbackDemoData.akad.date),
      venue: form.akadVenue || form.venue || fallbackDemoData.akad.venue,
      address: form.akadAddress || form.address || fallbackDemoData.akad.address,
      mapsUrl: form.akadMapsUrl || form.mapsUrl || fallbackDemoData.akad.mapsUrl,
    },
    reception: {
      date: joinDateTime(form.receptionDate, form.receptionTime, fallbackDemoData.reception.date),
      venue: form.receptionVenue || form.venue || fallbackDemoData.reception.venue,
      address: form.receptionAddress || form.address || fallbackDemoData.reception.address,
      mapsUrl: form.receptionMapsUrl || form.mapsUrl || fallbackDemoData.reception.mapsUrl,
    },
    loveStory: (form.loveStory || fallbackDemoData.loveStory).map((story) => ({
      year: story.year || story.date || "Momen",
      date: story.date || story.year || "Momen",
      title: story.title,
      description:
        ("description" in story && story.description) ||
        ("desc" in story && story.desc) ||
        "",
      photo: fallbackDemoData.loveStory[0].photo,
    })),
    gallery: form.galleryPhotos || fallbackDemoData.gallery,
    bankAccounts: form.giftBankName && form.giftBankAccount && form.giftBankAccountName
      ? [{ bank: form.giftBankName, number: form.giftBankAccount, name: form.giftBankAccountName }]
      : fallbackDemoData.bankAccounts,
    giftAddress: form.giftShippingAddress || fallbackDemoData.giftAddress,
  };
}

export function LiveDemoWrapper({ initialData, theme }: { initialData: LiveDemoData; theme: string }) {
  const [data, setData] = useState<LiveDemoData>(initialData);
  const [themeOverride, setThemeOverride] = useState<ThemePreviewOverride>({});

  useEffect(() => {
    setData(initialData);
  }, [initialData, theme]);

  useEffect(() => {
    function handleMessage(event: MessageEvent<PreviewMessage>) {
      if (event.origin !== window.location.origin) return;
      const message = event.data;

      if (message.type === "UPDATE_THEME_PREVIEW") {
        setThemeOverride(message.data);
        return;
      }

      if ((message.type === "UPDATE_PREVIEW" || message.type === "UPDATE_INVITATION_PREVIEW") && message.data) {
        setData(
          theme === "legacy"
            ? createLegacyData(message.data)
            : mapInvitationToFatehaData(createPreviewRecord(message.data), { isPreview: true }),
        );
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [theme]);

  const overrideStyle = useMemo(() => {
    const colors = themeOverride.colors || {};
    return Object.fromEntries(Object.entries(colors).map(([key, value]) => [`--preview-${key}`, value])) as CSSProperties;
  }, [themeOverride.colors]);

  let renderer;
  if (theme === "legacy") renderer = <InvitationClientWrapper data={data as LegacyDemoData} />;
  else if (theme === PETAL_SOFT_THEME_KEY) renderer = <PetalSoftTemplate data={data as FatehaInvitationData} />;
  else if (theme === OBSIDIAN_LUXE_THEME_KEY) renderer = <ObsidianLuxeTemplate data={data as FatehaInvitationData} />;
  else if (theme === JAWA_AGUNG_THEME_KEY) renderer = <JawaAgungTemplate data={data as FatehaInvitationData} />;
  else renderer = <FatehaThemeRendererWrapper data={data as FatehaInvitationData} />;

  return (
    <div
      className="min-h-dvh w-full"
      style={overrideStyle}
      data-preview-theme={theme || DEFAULT_INVITATION_THEME_KEY}
      data-theme-name={themeOverride.name}
    >
      {renderer}
    </div>
  );
}

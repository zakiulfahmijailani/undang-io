import type {
  FatehaGalleryItem,
  FatehaGiftAccount,
  FatehaInvitationData,
  FatehaRsvpMessage,
  FatehaStoryItem,
} from "@/components/themes/fateha";

const DEFAULT_GROOM_PHOTO = "/themes/fateha/images/groom.png";
const DEFAULT_BRIDE_PHOTO = "/themes/fateha/images/bride.png";
const DEFAULT_AUDIO = "/themes/fateha/audio/you-are-the-one.mp3";
const DEFAULT_DATE = "2026-06-12";
const DEFAULT_VENUE = "Masjid dan Gedung Pernikahan";
const DEFAULT_ADDRESS = "Alamat acara akan segera dilengkapi.";

type LooseRecord = Record<string, unknown>;

type GuestSessionLike = {
  slug?: string | null;
  id?: string | null;
  invitation_data?: unknown;
};

type InvitationLike = LooseRecord & {
  id?: string | null;
  slug?: string | null;
};

function asRecord(value: unknown): LooseRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LooseRecord) : {};
}

function readString(source: LooseRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  return null;
}

function readBoolean(source: LooseRecord, keys: string[], fallback = true): boolean {
  for (const key of keys) {
    if (typeof source[key] === "boolean") return source[key] as boolean;
  }
  return fallback;
}

function readArray<T>(source: LooseRecord, keys: string[], mapper: (item: unknown, index: number) => T | null): T[] {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value.map(mapper).filter((item): item is T => item !== null);
    }
  }
  return [];
}

function combineDateTime(date: string | null, time: string | null): string | null {
  if (!date) return null;
  if (!time) return date;
  if (date.includes("T")) return date;
  return `${date}T${time}`;
}

function dateFromValue(value: string | null): string | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString();
}

function formatDateDisplay(value: string | null) {
  if (!value) return "Tanggal akan diumumkan";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function formatDay(value: string | null) {
  if (!value) return "Hari";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Hari";
  return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date);
}

function getInitials(groom: string, bride: string) {
  return `${bride.trim().charAt(0) || "M"} ${groom.trim().charAt(0) || "P"}`.toUpperCase();
}

function mapStories(source: LooseRecord): FatehaStoryItem[] {
  const stories = readArray(source, ["love_story", "loveStory"], (item) => {
    const record = asRecord(item);
    const title = readString(record, ["title", "judul"]);
    const description = readString(record, ["description", "desc", "cerita"]);
    if (!title || !description) return null;
    return {
      year: readString(record, ["year", "tahun"]) ?? "Momen",
      title,
      description,
    };
  });

  return stories.length > 0
    ? stories
    : [
        {
          year: "Awal",
          title: "Pertemuan",
          description: "Setiap kisah baik memiliki awal yang sederhana dan doa yang terus tumbuh.",
        },
        {
          year: "Hari Ini",
          title: "Menuju Akad",
          description: "Dengan restu keluarga, kami melangkah menuju hari bahagia ini.",
        },
      ];
}

function mapGallery(source: LooseRecord, groomPhoto: string, bridePhoto: string): FatehaGalleryItem[] {
  const gallery = readArray(source, ["gallery_photos", "photo_gallery", "gallery", "photos"], (item, index) => {
    if (typeof item === "string" && item.trim().length > 0) {
      return {
        src: item.trim(),
        alt: `Galeri pernikahan ${index + 1}`,
      };
    }

    const record = asRecord(item);
    const src = readString(record, ["src", "url", "image", "image_url"]);
    if (!src) return null;
    return {
      src,
      alt: readString(record, ["alt", "caption"]) ?? `Galeri pernikahan ${index + 1}`,
      caption: readString(record, ["caption"]),
    };
  });

  return gallery.length > 0
    ? gallery
    : [
        { src: bridePhoto, alt: "Foto mempelai wanita", caption: "Mempelai Wanita" },
        { src: groomPhoto, alt: "Foto mempelai pria", caption: "Mempelai Pria" },
      ];
}

function mapGiftAccounts(source: LooseRecord): FatehaGiftAccount[] {
  const accounts = readArray(source, ["rekening", "giftAccounts", "gift_accounts"], (item) => {
    const record = asRecord(item);
    const bank = readString(record, ["bank", "name"]);
    const number = readString(record, ["number", "account", "account_number"]);
    const name = readString(record, ["owner", "account_name", "name"]);
    if (!bank || !number || !name) return null;
    return { bank, number, name };
  });

  const bank = readString(source, ["gift_bank_name", "giftBankName", "bankName"]);
  const number = readString(source, ["gift_bank_account", "giftBankAccount", "bankAccount"]);
  const name = readString(source, ["gift_bank_account_name", "giftBankAccountName", "bankAccountName"]);

  if (bank && number && name) {
    return [...accounts, { bank, number, name }];
  }

  return accounts;
}

function mapMessages(source: LooseRecord): FatehaRsvpMessage[] {
  return readArray(source, ["rsvp_messages", "messages", "guestbook"], (item, index) => {
    const record = asRecord(item);
    const name = readString(record, ["name", "guest_name"]);
    const message = readString(record, ["message", "ucapan"]);
    if (!name || !message) return null;
    return {
      id: readString(record, ["id"]) ?? `fallback-${index}`,
      name,
      attendance: readString(record, ["attendance", "attendance_status"]),
      message,
      createdAt: readString(record, ["created_at", "createdAt"]) ?? new Date().toISOString(),
    };
  });
}

function buildFatehaData(source: LooseRecord, options: { slug?: string | null; invitationId?: string | null; isPreview?: boolean }): FatehaInvitationData {
  const groomNickname = readString(source, ["groom_nickname", "groomNickname", "groom_name", "groomName"]) ?? "Mempelai Pria";
  const brideNickname = readString(source, ["bride_nickname", "brideNickname", "bride_name", "brideName"]) ?? "Mempelai Wanita";
  const groomFullName = readString(source, ["groom_full_name", "groomFullName", "groom_name", "groomName"]) ?? groomNickname;
  const brideFullName = readString(source, ["bride_full_name", "brideFullName", "bride_name", "brideName"]) ?? brideNickname;

  const groomPhoto =
    readString(source, ["groom_photo_url", "groomPhotoUrl", "groomPhoto", "photo_groom"]) ?? DEFAULT_GROOM_PHOTO;
  const bridePhoto =
    readString(source, ["bride_photo_url", "bridePhotoUrl", "bridePhoto", "photo_bride"]) ?? DEFAULT_BRIDE_PHOTO;

  const akadDate = dateFromValue(
    readString(source, ["akad_datetime", "akadDatetime"]) ??
      combineDateTime(readString(source, ["akad_date", "akadDate"]), readString(source, ["akad_time", "akadTime"])),
  );
  const receptionDate = dateFromValue(
    readString(source, ["resepsi_datetime", "resepsiDatetime", "reception_datetime", "receptionDatetime"]) ??
      combineDateTime(
        readString(source, ["reception_date", "receptionDate", "resepsiDate"]),
        readString(source, ["reception_time", "receptionTime", "resepsiTime"]),
      ),
  );
  const primaryDate = akadDate ?? receptionDate ?? DEFAULT_DATE;

  const akadVenue = readString(source, ["akad_location_name", "akadLocationName", "akad_venue", "akadVenue", "venue"]) ?? DEFAULT_VENUE;
  const akadAddress =
    readString(source, ["akad_location_address", "akadLocationAddress", "akad_address", "akadAddress", "address"]) ?? DEFAULT_ADDRESS;
  const receptionVenue =
    readString(source, [
      "resepsi_location_name",
      "resepsiLocationName",
      "reception_location_name",
      "receptionLocationName",
      "reception_venue",
      "receptionVenue",
      "venue",
    ]) ?? akadVenue;
  const receptionAddress =
    readString(source, [
      "resepsi_location_address",
      "resepsiLocationAddress",
      "reception_location_address",
      "receptionLocationAddress",
      "reception_address",
      "receptionAddress",
      "address",
    ]) ?? akadAddress;

  const quoteText =
    readString(source, ["quote_text", "quoteText", "quote", "greeting_text", "greetingText"]) ??
    "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri agar kamu cenderung dan merasa tenteram kepadanya.";

  return {
    slug: options.slug ?? readString(source, ["slug"]),
    invitationId: options.invitationId ?? readString(source, ["id", "invitation_id"]),
    isPreview: options.isPreview ?? false,
    monogram: getInitials(groomNickname, brideNickname),
    groom: {
      fullName: groomFullName,
      nickname: groomNickname,
      father: readString(source, ["groom_father_name", "groomFatherName", "groom_father", "groomFather"]),
      mother: readString(source, ["groom_mother_name", "groomMotherName", "groom_mother", "groomMother"]),
      child: readString(source, ["groom_child_order", "groomChildOrder"]),
      photo: groomPhoto,
    },
    bride: {
      fullName: brideFullName,
      nickname: brideNickname,
      father: readString(source, ["bride_father_name", "brideFatherName", "bride_father", "brideFather"]),
      mother: readString(source, ["bride_mother_name", "brideMotherName", "bride_mother", "brideMother"]),
      child: readString(source, ["bride_child_order", "brideChildOrder"]),
      photo: bridePhoto,
    },
    wedding: {
      date: primaryDate,
      dateDisplay: formatDateDisplay(primaryDate),
      day: formatDay(primaryDate),
      venue: receptionVenue || akadVenue,
      address: receptionAddress || akadAddress,
      mapsUrl: readString(source, ["maps_url", "mapsUrl", "akad_maps_url", "akadMapsUrl", "resepsi_maps_url", "receptionMapsUrl"]),
      akad: {
        label: "Akad Nikah",
        date: akadDate ?? primaryDate,
        time: readString(source, ["akad_time", "akadTime"]),
        venue: akadVenue,
        address: akadAddress,
        mapsUrl: readString(source, ["akad_maps_url", "akadMapsUrl", "maps_url", "mapsUrl"]),
      },
      reception: {
        label: "Resepsi",
        date: receptionDate ?? primaryDate,
        time: readString(source, ["reception_time", "receptionTime", "resepsiTime"]),
        venue: receptionVenue,
        address: receptionAddress,
        mapsUrl: readString(source, ["resepsi_maps_url", "receptionMapsUrl", "maps_url", "mapsUrl"]),
      },
    },
    quote: {
      bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      arabic:
        "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
      translation: quoteText,
      source: readString(source, ["quote_source", "quoteSource"]) ?? "QS. Ar-Rum: 21",
    },
    loveStory: mapStories(source),
    gallery: readBoolean(source, ["show_prewed_gallery", "showPrewedGallery"], true)
      ? mapGallery(source, groomPhoto, bridePhoto)
      : [],
    giftAccounts: readBoolean(source, ["show_gift_section", "showGiftSection"], true) ? mapGiftAccounts(source) : [],
    giftAddress: readString(source, ["gift_shipping_address", "giftShippingAddress", "giftAddress"]),
    contacts: [
      {
        name: "Keluarga Mempelai",
        role: "Informasi acara",
        phone: readString(source, ["contact_phone", "contactPhone", "whatsapp", "phone"]) ?? "",
      },
    ],
    rsvpMessages: mapMessages(source),
    musicUrl: readString(source, ["music_url", "musicUrl"]) ?? DEFAULT_AUDIO,
  };
}

export function mapGuestSessionToFatehaData(session: GuestSessionLike): FatehaInvitationData {
  return buildFatehaData(asRecord(session.invitation_data), {
    slug: session.slug,
    invitationId: session.id,
    isPreview: true,
  });
}

export function mapInvitationToFatehaData(invitation: InvitationLike, options?: { guestName?: string; isPreview?: boolean }): FatehaInvitationData {
  const data = buildFatehaData(invitation, {
    slug: invitation.slug,
    invitationId: invitation.id,
    isPreview: options?.isPreview ?? false,
  });

  if (!options?.guestName) return data;

  return {
    ...data,
    contacts: data.contacts,
  };
}

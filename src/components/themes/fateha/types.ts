export type FatehaPerson = {
  fullName: string;
  nickname: string;
  father: string | null;
  mother: string | null;
  child: string | null;
  photo: string;
};

export type FatehaEvent = {
  label: string;
  date: string | null;
  time: string | null;
  venue: string;
  address: string;
  mapsUrl: string | null;
};

export type FatehaContact = {
  name: string;
  role: string;
  phone: string;
};

export type FatehaStoryItem = {
  year: string;
  title: string;
  description: string;
};

export type FatehaGalleryItem = {
  src: string;
  alt: string;
  caption?: string | null;
};

export type FatehaGiftAccount = {
  bank: string;
  number: string;
  name: string;
};

export type FatehaRsvpMessage = {
  id: string;
  name: string;
  attendance: string | null;
  message: string;
  createdAt: string;
};

export type FatehaInvitationData = {
  slug?: string | null;
  invitationId?: string | null;
  isPreview?: boolean;
  sections_order?: string[] | null;
  sections_visibility?: Record<string, boolean> | null;
  show_couple_photos?: boolean;
  show_prewed_gallery?: boolean;
  show_gift_section?: boolean;
  monogram: string;
  groom: FatehaPerson;
  bride: FatehaPerson;
  wedding: {
    date: string | null;
    dateDisplay: string;
    day: string;
    venue: string;
    address: string;
    mapsUrl: string | null;
    akad: FatehaEvent;
    reception: FatehaEvent;
  };
  quote: {
    bismillah: string;
    arabic: string;
    translation: string;
    source: string;
  };
  loveStory: FatehaStoryItem[];
  gallery: FatehaGalleryItem[];
  giftAccounts: FatehaGiftAccount[];
  giftAddress: string | null;
  contacts: FatehaContact[];
  rsvpMessages: FatehaRsvpMessage[];
  musicUrl: string | null;
};

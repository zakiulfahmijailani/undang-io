export type InvitationPreviewPayload = {
  id?: string;
  slug?: string;
  groomFullName?: string;
  groomNickname?: string;
  groomFather?: string;
  groomMother?: string;
  groomPhotoUrl?: string;
  brideFullName?: string;
  brideNickname?: string;
  brideFather?: string;
  brideMother?: string;
  bridePhotoUrl?: string;
  couplePhotoUrl?: string;
  backgroundPhotoUrl?: string;
  akadDate?: string;
  akadTime?: string;
  akadVenue?: string;
  akadAddress?: string;
  akadMapsUrl?: string;
  receptionDate?: string;
  receptionTime?: string;
  receptionVenue?: string;
  receptionAddress?: string;
  receptionMapsUrl?: string;
  quote?: string;
  quoteSource?: string;
  quoteGreeting?: string;
  quoteArabic?: string;
  loveStory?: Array<{ year?: string; date?: string; title: string; description?: string; desc?: string }>;
  galleryPhotos?: string[];
  giftBankName?: string;
  giftBankAccount?: string;
  giftBankAccountName?: string;
  giftShippingAddress?: string;
  musicUrl?: string;
  showCouplePhotos?: boolean;
  showPrewedGallery?: boolean;
  showGiftSection?: boolean;
  rsvpEnabled?: boolean;
  sectionsOrder?: string[];
  sectionsVisibility?: Record<string, boolean>;
  venue?: string;
  address?: string;
  mapsUrl?: string;
};

export type ThemePreviewOverride = {
  name?: string;
  description?: string;
  colors?: Record<string, string>;
  typography?: Record<string, string>;
  config?: Record<string, unknown>;
  assets?: Record<string, string | null>;
};

export type PreviewMessage =
  | { type: "UPDATE_INVITATION_PREVIEW"; data: InvitationPreviewPayload }
  | { type: "UPDATE_THEME_PREVIEW"; data: ThemePreviewOverride }
  | { type: "UPDATE_PREVIEW"; data: InvitationPreviewPayload };


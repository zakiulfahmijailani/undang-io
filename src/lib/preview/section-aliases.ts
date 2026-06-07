export const CANONICAL_SECTION_ORDER = [
  "cover",
  "quote",
  "couple",
  "story",
  "countdown",
  "event",
  "gallery",
  "gift",
  "rsvp",
  "closing",
] as const;

export type CanonicalSectionId = (typeof CANONICAL_SECTION_ORDER)[number];

const SECTION_ALIASES: Record<string, CanonicalSectionId> = {
  hero: "cover",
  cover: "cover",
  quote: "quote",
  ayat: "quote",
  couple: "couple",
  mempelai: "couple",
  lovestory: "story",
  love_story: "story",
  loveStory: "story",
  story: "story",
  countdown: "countdown",
  event: "event",
  acara: "event",
  gallery: "gallery",
  galeri: "gallery",
  gift: "gift",
  amplop: "gift",
  rsvp: "rsvp",
  closing: "closing",
  penutup: "closing",
  music: "closing",
};

export function normalizeSectionId(section: string): CanonicalSectionId | null {
  return SECTION_ALIASES[section] ?? null;
}

export function normalizeSectionOrder(order?: string[] | null): CanonicalSectionId[] {
  const seen = new Set<CanonicalSectionId>();
  const normalized = (order ?? [])
    .map(normalizeSectionId)
    .filter((section): section is CanonicalSectionId => section !== null)
    .filter((section) => {
      if (seen.has(section)) return false;
      seen.add(section);
      return true;
    });

  for (const section of CANONICAL_SECTION_ORDER) {
    if (!seen.has(section)) normalized.push(section);
  }

  return normalized;
}

export function isCanonicalSectionVisible(
  visibility: Record<string, boolean> | null | undefined,
  section: CanonicalSectionId,
) {
  if (!visibility) return true;
  if (visibility[section] === false) return false;

  return !Object.entries(SECTION_ALIASES).some(
    ([alias, normalized]) => normalized === section && visibility[alias] === false,
  );
}


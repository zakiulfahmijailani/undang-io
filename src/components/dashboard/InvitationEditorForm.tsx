"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar, GalleryHorizontal, Gift, Heart, Image as ImageIcon, Info, Loader2, Music, Users } from "lucide-react";
import { toast } from "sonner";
import { SectionNavTab } from "@/components/dashboard/SectionNavTab";
import { InvitationPreviewShell } from "@/components/preview/InvitationPreviewShell";
import { LivePreviewWorkspace } from "@/components/preview/LivePreviewWorkspace";
import { DEFAULT_INVITATION_THEME_KEY } from "@/lib/default-theme";
import { normalizeSectionOrder } from "@/lib/preview/section-aliases";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { InformasiDasarSection } from "./sections/InformasiDasarSection";
import { DataMempelaiSection } from "./sections/DataMempelaiSection";
import { AcaraSection } from "./sections/AcaraSection";
import { AyatQuoteSection } from "./sections/AyatQuoteSection";
import { KisahCintaSection } from "./sections/KisahCintaSection";
import { GallerySection } from "./sections/GallerySection";
import { AmplopDigitalSection } from "./sections/AmplopDigitalSection";
import { MusikSection } from "./sections/MusikSection";
import { FotoCoverSection } from "./sections/FotoCoverSection";

export type LoveStoryItem = {
  year: string;
  title: string;
  description: string;
  photo?: string;
};

export type InvitationEditorInitialData = {
  id: string;
  slug: string;
  theme_key?: string | null;
  theme_id?: string | null;
  status: string | null;
  created_at: string | null;
  couple_photo_url?: string | null;
  background_photo_url?: string | null;
  groom_full_name: string | null;
  groom_nickname: string | null;
  groom_father_name: string | null;
  groom_mother_name: string | null;
  groom_photo_url?: string | null;
  bride_full_name: string | null;
  bride_nickname: string | null;
  bride_father_name: string | null;
  bride_mother_name: string | null;
  bride_photo_url?: string | null;
  akad_datetime: string | null;
  akad_location_name: string | null;
  akad_location_address: string | null;
  akad_maps_url?: string | null;
  resepsi_datetime: string | null;
  resepsi_location_name: string | null;
  resepsi_location_address: string | null;
  resepsi_maps_url?: string | null;
  dresscode_colors?: string | null;
  dresscode_note?: string | null;
  quote_text: string | null;
  quote_source?: string | null;
  music_url?: string | null;
  love_story?: LoveStoryItem[] | null;
  gallery_photos?: string[] | null;
  sections_order?: string[] | null;
  sections_visibility?: Record<string, boolean> | null;
  gift_bank_name: string | null;
  gift_bank_account: string | null;
  gift_bank_account_name: string | null;
  gift_shipping_address: string | null;
  qris_account?: string | null;
  show_couple_photos: boolean | null;
  show_prewed_gallery: boolean | null;
  show_gift_section: boolean | null;
  rsvp_enabled?: boolean | null;
};

type ApiResponse<T> = {
  data: T | null;
  error: { code: string; message: string } | null;
};

const sectionComponents: Record<string, React.ComponentType<any>> = {
  "informasi-dasar": InformasiDasarSection,
  "foto-cover": FotoCoverSection,
  "data-mempelai": DataMempelaiSection,
  "acara": AcaraSection,
  "ayat-quote": AyatQuoteSection,
  "kisah-cinta": KisahCintaSection,
  "galeri-foto": GallerySection,
  "amplop-digital": AmplopDigitalSection,
  "musik": MusikSection,
};

export default function InvitationEditorForm({
  initialData,
  isCreateMode,
  themeId,
  themeKey,
  wizardMode,
  onWizardNext,
}: {
  initialData?: Partial<InvitationEditorInitialData>;
  isCreateMode?: boolean;
  themeId?: string;
  themeKey?: string;
  wizardMode?: boolean;
  onWizardNext?: (data: Partial<InvitationEditorInitialData>) => void;
}) {
  const router = useRouter();
  
  const [localDraft, setLocalDraft] = useState<Partial<InvitationEditorInitialData>>(() => ({
    status: "draft",
    sections_order: normalizeSectionOrder(),
    sections_visibility: {},
    ...initialData
  }));
  
  const [activeSection, setActiveSection] = useState("informasi-dasar");
  const [isSaving, setIsSaving] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);

  const patchDraft = (patch: Partial<InvitationEditorInitialData>) => {
    setLocalDraft(prev => ({ ...prev, ...patch }));
  };

  const handleReorder = (activeId: string, overId: string) => {
    const keyToCanonical: Record<string, string> = {
      "ayat-quote": "quote",
      "kisah-cinta": "story",
      "acara": "event",
      "galeri-foto": "gallery",
      "amplop-digital": "gift",
    };

    const currentOrder = localDraft.sections_order || normalizeSectionOrder();
    
    const activeCanonical = keyToCanonical[activeId];
    const overCanonical = keyToCanonical[overId];

    if (!activeCanonical || !overCanonical) return;

    const oldIndex = currentOrder.indexOf(activeCanonical);
    const newIndex = currentOrder.indexOf(overCanonical);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = [...currentOrder];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, activeCanonical);
      patchDraft({ sections_order: newOrder });
    }
  };

  const isPremium = true;

  const baseSortableSections = [
    { key: "ayat-quote", canonical: "quote", label: "Ayat & Quote", icon: BookOpen,
      enabled: localDraft.sections_visibility?.quote !== false,
      onToggle: (v: boolean) => patchDraft({ sections_visibility: { ...localDraft.sections_visibility, quote: v } }) },
    { key: "kisah-cinta", canonical: "story", label: "Kisah Cinta", icon: Heart,
      enabled: localDraft.sections_visibility?.story !== false,
      onToggle: (v: boolean) => patchDraft({ sections_visibility: { ...localDraft.sections_visibility, story: v } }) },
    { key: "acara", canonical: "event", label: "Acara", icon: Calendar,
      enabled: localDraft.sections_visibility?.event !== false,
      onToggle: (v: boolean) => patchDraft({ sections_visibility: { ...localDraft.sections_visibility, event: v } }) },
    { key: "galeri-foto", canonical: "gallery", label: "Galeri Foto", icon: GalleryHorizontal,
      enabled: localDraft.show_prewed_gallery !== false,
      onToggle: (v: boolean) => patchDraft({ show_prewed_gallery: v }) },
    { key: "amplop-digital", canonical: "gift", label: "Amplop Digital", icon: Gift,
      enabled: localDraft.show_gift_section !== false,
      onToggle: (v: boolean) => patchDraft({ show_gift_section: v }) },
  ];

  const currentOrder = localDraft.sections_order || normalizeSectionOrder();
  
  const sortedSortableSections = [...baseSortableSections].sort((a, b) => {
    const indexA = currentOrder.indexOf(a.canonical);
    const indexB = currentOrder.indexOf(b.canonical);
    const finalA = indexA === -1 ? 999 : indexA;
    const finalB = indexB === -1 ? 999 : indexB;
    return finalA - finalB;
  });

  const sections = [
    { key: "informasi-dasar", label: "Informasi Dasar", icon: Info, draggable: false },
    { key: "foto-cover", label: "Foto & Cover", icon: ImageIcon, locked: true, draggable: false },
    { key: "data-mempelai", label: "Data Mempelai", icon: Users, locked: true, draggable: false },
    ...sortedSortableSections.map(s => ({ ...s, draggable: true })),
    { key: "musik", label: "Musik", icon: Music, draggable: false,
      enabled: localDraft.sections_visibility?.music !== false,
      onToggle: (v: boolean) => patchDraft({ sections_visibility: { ...localDraft.sections_visibility, music: v } })
    },
  ];

  async function handleSave() {
    setIsSaving(true);
    try {
      if (isCreateMode) {
        const response = await fetch(`/api/invitations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...localDraft, theme_id: themeId, details: { ...localDraft } }),
        });
        const result = (await response.json()) as ApiResponse<{ id: string }>;
        if (!response.ok || result.error) { toast.error(result.error?.message || "Gagal menyimpan undangan."); return; }
        if (result.data?.id) {
          await fetch(`/api/invitations/${result.data.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(localDraft),
          });
          toast.success("Undangan berhasil dibuat!");
          router.push(`/dashboard/undangan/${result.data.id}/edit`);
        }
      } else {
        const response = await fetch(`/api/invitations/${initialData?.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(localDraft),
        });
        const result = (await response.json()) as ApiResponse<{ success: boolean }>;
        if (!response.ok || result.error) {
          toast.error(result.error?.message || "Gagal menyimpan perubahan.");
          return;
        }
        toast.success("Perubahan tersimpan.");
      }
    } catch (error) {
      console.error("[editor] save failed:", error);
      toast.error("Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  }

  const ActiveSection = sectionComponents[activeSection];

  const topBar = (
    <div className="bg-white border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {!wizardMode && (
          <Button variant="ghost" className="w-8 h-8 p-0" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-sm font-semibold">
            {wizardMode ? "Lengkapi Data Undangan" : `Edit: ${localDraft.groom_nickname || "Pria"} & ${localDraft.bride_nickname || "Wanita"}`}
          </h1>
          {!wizardMode && (
            <p className="text-xs text-muted-foreground">
              undang.io/invite/{localDraft.slug || "nama-pasangan"}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {wizardMode ? (
          <Button size="sm" className="bg-landing-maroon text-white hover:bg-landing-maroon-dark rounded-full shadow-sm" onClick={() => onWizardNext?.(localDraft)}>
            Lanjut Pratinjau 🚀
          </Button>
        ) : (
          <Button size="sm" onClick={() => void handleSave()} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Simpan Semua
          </Button>
        )}
      </div>
    </div>
  );

  const formPanel = (
    <div className="grid min-h-full bg-landing-cream/45 md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b border-landing-border bg-white md:border-b-0 md:border-r">
        <SectionNavTab sections={sections} activeSection={activeSection} onSelect={setActiveSection} onReorder={handleReorder} />
      </aside>
      <div className="min-w-0 p-4 md:p-6 bg-white">
        {ActiveSection && <ActiveSection data={localDraft} onChange={patchDraft} />}
      </div>
    </div>
  );

  const previewPayload = useMemo(() => {
    return {
      id: localDraft.id,
      slug: localDraft.slug,
      groomFullName: localDraft.groom_full_name,
      groomNickname: localDraft.groom_nickname,
      groomFather: localDraft.groom_father_name,
      groomMother: localDraft.groom_mother_name,
      groomPhotoUrl: localDraft.groom_photo_url,
      brideFullName: localDraft.bride_full_name,
      brideNickname: localDraft.bride_nickname,
      brideFather: localDraft.bride_father_name,
      brideMother: localDraft.bride_mother_name,
      bridePhotoUrl: localDraft.bride_photo_url,
      couplePhotoUrl: localDraft.couple_photo_url,
      backgroundPhotoUrl: localDraft.background_photo_url,
      akadDate: localDraft.akad_datetime,
      akadVenue: localDraft.akad_location_name,
      akadAddress: localDraft.akad_location_address,
      akadMapsUrl: localDraft.akad_maps_url,
      receptionDate: localDraft.resepsi_datetime,
      receptionVenue: localDraft.resepsi_location_name,
      receptionAddress: localDraft.resepsi_location_address,
      receptionMapsUrl: localDraft.resepsi_maps_url,
      quote: localDraft.quote_text,
      quoteSource: localDraft.quote_source,
      loveStory: localDraft.love_story as any,
      galleryPhotos: localDraft.gallery_photos,
      giftBankName: localDraft.gift_bank_name,
      giftBankAccount: localDraft.gift_bank_account,
      giftBankAccountName: localDraft.gift_bank_account_name,
      giftShippingAddress: localDraft.gift_shipping_address,
      musicUrl: localDraft.music_url,
      showCouplePhotos: localDraft.show_couple_photos,
      showPrewedGallery: localDraft.show_prewed_gallery,
      showGiftSection: localDraft.show_gift_section,
      rsvpEnabled: localDraft.rsvp_enabled,
      sectionsOrder: localDraft.sections_order,
      sectionsVisibility: localDraft.sections_visibility as any,
    };
  }, [localDraft]);

  const resolvedThemeKey = themeKey || localDraft.theme_key || DEFAULT_INVITATION_THEME_KEY;

  const preview = (
    <InvitationPreviewShell
      themeKey={resolvedThemeKey}
      invitationData={previewPayload as any}
      url={`/invite/${localDraft.slug || "nama-pasangan"}`}
      isLive
      className="h-full"
    />
  );

  return (
    <LivePreviewWorkspace
      className={cn("min-h-[calc(100dvh-4rem)]", !wizardMode && "-m-5 min-h-screen md:-m-8")}
      topBar={topBar}
      topBarClassName={wizardMode ? "top-16" : "top-0"}
      form={formPanel}
      preview={preview}
      previewVisible={previewVisible}
      showDesktopToggle={true}
      onPreviewVisibleChange={setPreviewVisible}
    />
  );
}

/* Invitation editor client for /dashboard/undangan/[id]/edit based on docs/design/undangio-invitation-editor-dashboard.png.png. */

"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Copy,
  Eye,
  EyeOff,
  Gift,
  Heart,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Music,
  Save,
  Settings,
  Sparkles,
  Type,
  Upload,
  Users,
  Info,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import DndSectionsEditor from "@/components/dashboard/DndSectionsEditor";
import { SectionNavTab, type SectionItem } from "@/components/dashboard/SectionNavTab";
import { InvitationPreviewShell } from "@/components/preview/InvitationPreviewShell";
import { LivePreviewWorkspace } from "@/components/preview/LivePreviewWorkspace";
import { DEFAULT_INVITATION_THEME_KEY } from "@/lib/default-theme";
import { normalizeSectionOrder } from "@/lib/preview/section-aliases";
import { cn } from "@/lib/utils";
import type { InvitationPreviewPayload } from "@/types/preview";

// Shadcn UI components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type LoveStoryItem = {
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

type EditorForm = {
  status: string;
  slug: string;
  groom_name: string;
  bride_name: string;
  groom_full_name: string;
  bride_full_name: string;
  groom_father: string;
  groom_mother: string;
  bride_father: string;
  bride_mother: string;
  groom_photo_url: string;
  bride_photo_url: string;
  couple_photo_url: string;
  background_photo_url: string;
  akad_date: string;
  akad_venue: string;
  akad_address: string;
  akad_maps_url: string;
  reception_date: string;
  reception_venue: string;
  reception_address: string;
  reception_maps_url: string;
  dresscode_colors: string;
  dresscode_note: string;
  greeting_text: string;
  quote_source: string;
  music_url: string;
  love_story: LoveStoryItem[];
  gallery_photos: string[];
  gift_bank_name: string;
  gift_bank_account: string;
  gift_bank_account_name: string;
  gift_shipping_address: string;
  qris_account: string;
  sections_order: string[];
  sections_visibility: Record<string, boolean>;
  show_couple_photos: boolean;
  show_prewed_gallery: boolean;
  show_gift_section: boolean;
  rsvp_enabled: boolean;
};

type ApiResponse<T> = {
  data: T | null;
  error: { code: string; message: string } | null;
};

type UploadResponse = {
  url: string;
  key: string;
};

type TabId = "info-dasar" | "foto-cover" | "mempelai" | "ayat-quote" | "kisah-cinta" | "acara" | "galeri" | "amplop" | "musik" | "publikasi";

const tabs: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: "info-dasar", label: "Informasi Dasar", icon: Info },
  { id: "foto-cover", label: "Foto & Cover", icon: ImageIcon },
  { id: "mempelai", label: "Data Mempelai", icon: Users },
  { id: "ayat-quote", label: "Ayat & Quote", icon: Type },
  { id: "kisah-cinta", label: "Kisah Cinta", icon: Heart },
  { id: "acara", label: "Acara", icon: MapPin },
  { id: "galeri", label: "Galeri Foto", icon: Camera },
  { id: "amplop", label: "Amplop Digital", icon: Gift },
  { id: "musik", label: "Musik", icon: Music },
  { id: "publikasi", label: "Publikasi", icon: Settings },
];

const defaultLoveStory: LoveStoryItem[] = [
  { year: "2020", title: "Pertama Bertemu", description: "" },
  { year: "2022", title: "Lamaran", description: "" },
  { year: "2026", title: "Hari Bahagia", description: "" },
];

const defaultSections = normalizeSectionOrder();

function initialForm(data?: Partial<InvitationEditorInitialData>): EditorForm {
  return {
    status: data?.status || "draft",
    slug: data?.slug || "",
    groom_name: data?.groom_nickname || "",
    bride_name: data?.bride_nickname || "",
    groom_full_name: data?.groom_full_name || "",
    bride_full_name: data?.bride_full_name || "",
    groom_father: data?.groom_father_name || "",
    groom_mother: data?.groom_mother_name || "",
    bride_father: data?.bride_father_name || "",
    bride_mother: data?.bride_mother_name || "",
    groom_photo_url: data?.groom_photo_url || "",
    bride_photo_url: data?.bride_photo_url || "",
    couple_photo_url: data?.couple_photo_url || "",
    background_photo_url: data?.background_photo_url || "",
    akad_date: data?.akad_datetime || "",
    akad_venue: data?.akad_location_name || "",
    akad_address: data?.akad_location_address || "",
    akad_maps_url: data?.akad_maps_url || "",
    reception_date: data?.resepsi_datetime || "",
    reception_venue: data?.resepsi_location_name || "",
    reception_address: data?.resepsi_location_address || "",
    reception_maps_url: data?.resepsi_maps_url || "",
    dresscode_colors: data?.dresscode_colors || "",
    dresscode_note: data?.dresscode_note || "",
    greeting_text: data?.quote_text || "",
    quote_source: data?.quote_source || "Mempelai",
    music_url: data?.music_url || "",
    love_story: data?.love_story?.length ? data?.love_story : defaultLoveStory,
    gallery_photos: data?.gallery_photos || [],
    gift_bank_name: data?.gift_bank_name || "",
    gift_bank_account: data?.gift_bank_account || "",
    gift_bank_account_name: data?.gift_bank_account_name || "",
    gift_shipping_address: data?.gift_shipping_address || "",
    qris_account: data?.qris_account || "",
    sections_order: data?.sections_order || defaultSections,
    sections_visibility: data?.sections_visibility || {},
    show_couple_photos: data?.show_couple_photos ?? true,
    show_prewed_gallery: data?.show_prewed_gallery ?? true,
    show_gift_section: data?.show_gift_section ?? true,
    rsvp_enabled: data?.rsvp_enabled ?? true,

      };
}

// Custom components removed in favor of Shadcn UI components.

export default function InvitationEditorForm({
  initialData,
  isCreateMode,
  themeId,
  themeKey,
}: {
  initialData?: Partial<InvitationEditorInitialData>;
  isCreateMode?: boolean;
  themeId?: string;
  themeKey?: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<EditorForm>(() => initialForm(initialData));
  const [activeTab, setActiveTab] = useState<TabId>("info-dasar");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof EditorForm>(key: K, value: EditorForm[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const previewPayload = useMemo<InvitationPreviewPayload>(() => ({
    id: initialData?.id,
    slug: formData.slug,
    groomFullName: formData.groom_full_name,
    groomNickname: formData.groom_name,
    groomFather: formData.groom_father,
    groomMother: formData.groom_mother,
    groomPhotoUrl: formData.groom_photo_url,
    brideFullName: formData.bride_full_name,
    brideNickname: formData.bride_name,
    brideFather: formData.bride_father,
    brideMother: formData.bride_mother,
    bridePhotoUrl: formData.bride_photo_url,
    couplePhotoUrl: formData.couple_photo_url,
    backgroundPhotoUrl: formData.background_photo_url,
    akadDate: formData.akad_date,
    akadVenue: formData.akad_venue,
    akadAddress: formData.akad_address,
    akadMapsUrl: formData.akad_maps_url,
    receptionDate: formData.reception_date,
    receptionVenue: formData.reception_venue,
    receptionAddress: formData.reception_address,
    receptionMapsUrl: formData.reception_maps_url,
    quote: formData.greeting_text,
    quoteSource: formData.quote_source,
    loveStory: formData.love_story,
    galleryPhotos: formData.gallery_photos,
    giftBankName: formData.gift_bank_name,
    giftBankAccount: formData.gift_bank_account,
    giftBankAccountName: formData.gift_bank_account_name,
    giftShippingAddress: formData.gift_shipping_address,
    musicUrl: formData.music_url,
    showCouplePhotos: formData.show_couple_photos,
    showPrewedGallery: formData.show_prewed_gallery,
    showGiftSection: formData.show_gift_section,
    rsvpEnabled: formData.rsvp_enabled,
    sectionsOrder: formData.sections_order,
    sectionsVisibility: formData.sections_visibility,
  }), [formData, initialData?.id]);

  const resolvedThemeKey =
    themeKey ||
    initialData?.theme_key ||
    (themeId && !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(themeId) ? themeId : undefined) ||
    DEFAULT_INVITATION_THEME_KEY;

  async function handleSave(nextStatus?: string) {
    setIsSaving(true);
    const payload = nextStatus ? { ...formData, status: nextStatus } : formData;

    try {
      if (isCreateMode) {
        const response = await fetch(`/api/invitations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, theme_id: themeId, details: { ...payload } }),
        });
        const result = (await response.json()) as ApiResponse<{ id: string }>;
        if (!response.ok || result.error) { toast.error(result.error?.message || "Gagal menyimpan undangan."); return; }
        if (result.data?.id) {
          await fetch(`/api/invitations/${result.data.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          toast.success("Undangan berhasil dibuat!");
          router.push(`/dashboard/undangan/${result.data.id}/edit`);
        }
      } else {
        const response = await fetch(`/api/invitations/${initialData?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ApiResponse<{ success: boolean }>;

      if (!response.ok || result.error) {
        toast.error(result.error?.message || "Gagal menyimpan perubahan.");
        return;
      }

      if (nextStatus) {
        updateField("status", nextStatus);
      }
      toast.success(nextStatus === "active" ? "Undangan dipublikasikan." : "Perubahan tersimpan.");
      }
    } catch (error) {
      console.error("[editor] save failed:", error);
      toast.error("Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpload(file: File | null) {
    if (!file) return;
    if (isCreateMode) { toast.error("Simpan undangan terlebih dahulu untuk mengunggah foto."); return; }
    setIsUploading(true);

    const body = new FormData();
    body.set("file", file);
    body.set("invitation_id", initialData?.id || "");
    body.set("type", "cover");

    try {
      const response = await fetch("/api/upload", { method: "POST", body });
      const result = (await response.json()) as ApiResponse<UploadResponse>;

      if (!response.ok || !result.data) {
        toast.error(result.error?.message || "Gagal mengunggah foto.");
        return;
      }

      updateField("couple_photo_url", result.data.url);
      toast.success("Foto berhasil diunggah.");
    } catch (error) {
      console.error("[editor] upload failed:", error);
      toast.error("Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/u/${formData.slug}`;
    void navigator.clipboard.writeText(url);
    toast.success("Tautan undangan disalin.");
  }

  function updateStory(index: number, field: keyof LoveStoryItem, value: string) {
    const next = [...formData.love_story];
    next[index] = { ...next[index], [field]: value };
    updateField("love_story", next);
  }

  function togglePreviewSection(section: string, enabled: boolean) {
    updateField("sections_visibility", { ...formData.sections_visibility, [section]: enabled });
    if (section === "gallery") updateField("show_prewed_gallery", enabled);
    if (section === "gift") updateField("show_gift_section", enabled);
    if (section === "rsvp") updateField("rsvp_enabled", enabled);
    if (section === "couple") updateField("show_couple_photos", enabled);
  }

  const sectionItems: SectionItem[] = tabs.map((tab) => {
    const sectionByTab: Partial<Record<TabId, string>> = {
      mempelai: "couple",
      "ayat-quote": "quote",
      "kisah-cinta": "story",
      acara: "event",
      galeri: "gallery",
      amplop: "gift",
    };
    const section = sectionByTab[tab.id];

    return {
      key: tab.id,
      label: tab.label,
      icon: tab.icon,
      enabled: section ? formData.sections_visibility[section] !== false : undefined,
      onToggle: section ? (enabled: boolean) => togglePreviewSection(section, enabled) : undefined,
    };
  });

  function renderTab() {
    return (
      <div className="space-y-6">
        <Card className="rounded-3xl border-landing-border shadow-landing-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-landing-serif text-2xl text-landing-ink">
              {tabs.find(t => t.id === activeTab)?.icon && (() => {
                const Icon = tabs.find(t => t.id === activeTab)!.icon;
                return <Icon className="h-5 w-5 text-landing-maroon" />;
              })()}
              {tabs.find(t => t.id === activeTab)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="font-ui">
            {activeTab === "info-dasar" && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Status Undangan</Label>
                  <Select value={formData.status} onChange={(e) => updateField("status", e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="active">Aktif</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Slug / URL Undangan</Label>
                  <Input value={formData.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="nama-pasangan" />
                  <p className="text-xs text-muted-foreground">undang.io/u/{formData.slug || "nama-pasangan"}</p>
                </div>
              </div>
            )}
            
            {activeTab === "foto-cover" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Foto Cover Utama</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {formData.couple_photo_url ? (
                        <img src={formData.couple_photo_url} alt="Cover" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="m-auto h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
                        className="hidden"
                      />
                      <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Unggah Foto
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">Digunakan untuk hero, cover, dan link preview.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Foto Background (Opsional)</Label>
                  <Input value={formData.background_photo_url} onChange={(e) => updateField("background_photo_url", e.target.value)} placeholder="URL gambar background" />
                </div>
              </div>
            )}

            {activeTab === "mempelai" && (
              <div className="grid gap-6">
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold text-landing-maroon">Mempelai Pria</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nama Lengkap</Label>
                      <Input value={formData.groom_full_name} onChange={(e) => updateField("groom_full_name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Panggilan</Label>
                      <Input value={formData.groom_name} onChange={(e) => updateField("groom_name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Ayah</Label>
                      <Input value={formData.groom_father} onChange={(e) => updateField("groom_father", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Ibu</Label>
                      <Input value={formData.groom_mother} onChange={(e) => updateField("groom_mother", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>URL Foto Pria (Opsional)</Label>
                      <Input value={formData.groom_photo_url} onChange={(e) => updateField("groom_photo_url", e.target.value)} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold text-landing-maroon">Mempelai Wanita</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nama Lengkap</Label>
                      <Input value={formData.bride_full_name} onChange={(e) => updateField("bride_full_name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Panggilan</Label>
                      <Input value={formData.bride_name} onChange={(e) => updateField("bride_name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Ayah</Label>
                      <Input value={formData.bride_father} onChange={(e) => updateField("bride_father", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Ibu</Label>
                      <Input value={formData.bride_mother} onChange={(e) => updateField("bride_mother", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>URL Foto Wanita (Opsional)</Label>
                      <Input value={formData.bride_photo_url} onChange={(e) => updateField("bride_photo_url", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ayat-quote" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Teks Ayat / Kutipan</Label>
                  <Textarea value={formData.greeting_text} onChange={(e) => updateField("greeting_text", e.target.value)} rows={5} />
                </div>
                <div className="space-y-2">
                  <Label>Sumber Kutipan</Label>
                  <Input value={formData.quote_source} onChange={(e) => updateField("quote_source", e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === "kisah-cinta" && (
              <div className="space-y-6">
                {formData.love_story.map((story, index) => (
                  <div key={index} className="space-y-4 rounded-lg border bg-landing-cream p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">Cerita {index + 1}</h4>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Tahun / Waktu</Label>
                        <Input value={story.year} onChange={(e) => updateStory(index, "year", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Judul Singkat</Label>
                        <Input value={story.title} onChange={(e) => updateStory(index, "title", e.target.value)} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Deskripsi Cerita</Label>
                        <Textarea value={story.description} onChange={(e) => updateStory(index, "description", e.target.value)} rows={3} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "acara" && (
              <div className="grid gap-6">
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold text-landing-maroon">Akad Nikah / Pemberkatan</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Tanggal & Waktu</Label>
                      <Input type="datetime-local" value={formData.akad_date} onChange={(e) => updateField("akad_date", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Gedung/Tempat</Label>
                      <Input value={formData.akad_venue} onChange={(e) => updateField("akad_venue", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Alamat Lengkap</Label>
                      <Textarea value={formData.akad_address} onChange={(e) => updateField("akad_address", e.target.value)} rows={2} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>URL Google Maps</Label>
                      <Input value={formData.akad_maps_url} onChange={(e) => updateField("akad_maps_url", e.target.value)} placeholder="https://maps.google.com/..." />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold text-landing-maroon">Resepsi</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Tanggal & Waktu</Label>
                      <Input type="datetime-local" value={formData.reception_date} onChange={(e) => updateField("reception_date", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Gedung/Tempat</Label>
                      <Input value={formData.reception_venue} onChange={(e) => updateField("reception_venue", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Alamat Lengkap</Label>
                      <Textarea value={formData.reception_address} onChange={(e) => updateField("reception_address", e.target.value)} rows={2} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>URL Google Maps</Label>
                      <Input value={formData.reception_maps_url} onChange={(e) => updateField("reception_maps_url", e.target.value)} placeholder="https://maps.google.com/..." />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold text-landing-maroon">Dress Code (Opsional)</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Warna Tema</Label>
                      <Input value={formData.dresscode_colors} onChange={(e) => updateField("dresscode_colors", e.target.value)} placeholder="Contoh: Putih, Gold" />
                    </div>
                    <div className="space-y-2">
                      <Label>Catatan Tambahan</Label>
                      <Input value={formData.dresscode_note} onChange={(e) => updateField("dresscode_note", e.target.value)} placeholder="Gunakan pakaian yang nyaman" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "galeri" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tampilkan Galeri Prewedding</Label>
                    <p className="text-sm text-muted-foreground">Galeri akan muncul di undangan publik</p>
                  </div>
                  <Switch checked={formData.show_prewed_gallery} onCheckedChange={(c) => updateField("show_prewed_gallery", c)} />
                </div>
                {/* File upload for gallery is omitted for brevity, you can add multiple uploads here later */}
                <p className="text-sm text-muted-foreground italic">Fitur upload banyak foto galeri dapat ditambahkan kemudian.</p>
              </div>
            )}

            {activeTab === "amplop" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tampilkan Amplop Digital</Label>
                    <p className="text-sm text-muted-foreground">Tamu dapat melihat rekening dan alamat hadiah</p>
                  </div>
                  <Switch checked={formData.show_gift_section} onCheckedChange={(c) => updateField("show_gift_section", c)} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nama Bank</Label>
                    <Input value={formData.gift_bank_name} onChange={(e) => updateField("gift_bank_name", e.target.value)} placeholder="BCA / Mandiri" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor Rekening</Label>
                    <Input value={formData.gift_bank_account} onChange={(e) => updateField("gift_bank_account", e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nama Pemilik Rekening</Label>
                    <Input value={formData.gift_bank_account_name} onChange={(e) => updateField("gift_bank_account_name", e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>URL/Link QRIS (Opsional)</Label>
                    <Input value={formData.qris_account} onChange={(e) => updateField("qris_account", e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Alamat Kirim Hadiah Fisik</Label>
                    <Textarea value={formData.gift_shipping_address} onChange={(e) => updateField("gift_shipping_address", e.target.value)} rows={3} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "musik" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Background Music URL (MP3/YouTube)</Label>
                  <Input value={formData.music_url} onChange={(e) => updateField("music_url", e.target.value)} placeholder="https://..." />
                </div>
              </div>
            )}

            {activeTab === "publikasi" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tampilkan Kisah Cinta</Label>
                  </div>
                  <Switch checked={formData.sections_visibility.lovestory !== false} onCheckedChange={(c) => updateField("sections_visibility", { ...formData.sections_visibility, lovestory: c })} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Aktifkan RSVP</Label>
                    <p className="text-sm text-muted-foreground">Tamu dapat mengisi form kehadiran</p>
                  </div>
                  <Switch checked={formData.rsvp_enabled} onCheckedChange={(c) => updateField("rsvp_enabled", c)} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tampilkan Foto Pasangan</Label>
                  </div>
                  <Switch checked={formData.show_couple_photos} onCheckedChange={(c) => updateField("show_couple_photos", c)} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const topBar = (
    <header className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-landing-border bg-white px-4 py-2 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/dashboard" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-landing-ink hover:bg-landing-cream">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Kembali ke dashboard</span>
        </Link>
        <div className="min-w-0">
          <h1 className="truncate font-landing-serif text-xl font-semibold text-landing-ink">
            {isCreateMode ? "Buat Undangan Baru" : `Edit: ${formData.groom_name || "Mempelai"} & ${formData.bride_name || "Pasangan"}`}
          </h1>
          <button type="button" onClick={copyLink} className="flex max-w-full items-center gap-1 truncate font-ui text-xs text-landing-muted hover:text-landing-maroon">
            undang.io/u/{formData.slug || "nama-mempelai"}
            <Copy className="h-3 w-3 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="secondary" size="sm" className="hidden lg:inline-flex" onClick={() => setPreviewVisible((visible) => !visible)}>
          {previewVisible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          {previewVisible ? "Sembunyikan Preview" : "Tampilkan Preview"}
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => void handleSave("active")} disabled={isSaving}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Publikasikan
        </Button>
        <Button type="button" size="sm" onClick={() => void handleSave()} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          Simpan Semua
        </Button>
      </div>
    </header>
  );

  const formPanel = (
    <div className="grid min-h-full bg-landing-cream/45 md:grid-cols-[210px_minmax(0,1fr)]">
      <aside className="border-b border-landing-border bg-white md:border-b-0 md:border-r">
        <div className="border-b border-landing-border p-3">
          <div className="rounded-lg bg-landing-cream p-3">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-landing-gold">Status Undangan</p>
            <div className="mt-2 flex items-center gap-2 font-ui text-sm font-semibold text-landing-ink">
              <span className={cn("h-2.5 w-2.5 rounded-full", formData.status === "active" ? "bg-emerald-500" : "bg-landing-gold")} />
              {formData.status === "active" ? "Aktif (Publik)" : "Draft"}
            </div>
          </div>
        </div>
        <SectionNavTab sections={sectionItems} activeSection={activeTab} onSelect={(key) => setActiveTab(key as TabId)} />
        <div className="border-t border-landing-border p-3">
          <p className="mb-2 font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-landing-muted">Urutan Tampilan</p>
          <DndSectionsEditor
            sections={formData.sections_order}
            visibility={formData.sections_visibility}
            onSectionsChange={(sections) => updateField("sections_order", sections)}
            onVisibilityChange={(visibility) => updateField("sections_visibility", visibility)}
          />
        </div>
      </aside>
      <div className="min-w-0 p-4 md:p-5">{renderTab()}</div>
    </div>
  );

  const preview = (
    <InvitationPreviewShell
      themeKey={resolvedThemeKey}
      invitationData={previewPayload}
      url={`/invite/${formData.slug || "nama-mempelai"}`}
      isLive
      className="h-full"
    />
  );

  return (
    <LivePreviewWorkspace
      className="-m-5 min-h-screen bg-landing-cream md:-m-8"
      topBar={topBar}
      form={formPanel}
      preview={preview}
      previewVisible={previewVisible}
      onPreviewVisibleChange={setPreviewVisible}
    />
  );
}

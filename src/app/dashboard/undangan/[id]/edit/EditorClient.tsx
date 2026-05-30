/* Invitation editor client for /dashboard/undangan/[id]/edit based on docs/design/undangio-invitation-editor-dashboard.png.png. */

"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  Copy,
  Eye,
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
} from "lucide-react";
import { toast } from "sonner";
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";
import { demoData } from "@/data/demoInvitation";
import { cn } from "@/lib/utils";

type LoveStoryItem = {
  year: string;
  title: string;
  description: string;
  photo?: string;
};

export type InvitationEditorInitialData = {
  id: string;
  slug: string;
  status: string | null;
  created_at: string | null;
  couple_photo_url?: string | null;
  groom_full_name: string | null;
  groom_nickname: string | null;
  groom_father_name: string | null;
  groom_mother_name: string | null;
  bride_full_name: string | null;
  bride_nickname: string | null;
  bride_father_name: string | null;
  bride_mother_name: string | null;
  akad_datetime: string | null;
  akad_location_name: string | null;
  akad_location_address: string | null;
  resepsi_datetime: string | null;
  resepsi_location_name: string | null;
  resepsi_location_address: string | null;
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
  show_couple_photos: boolean | null;
  show_prewed_gallery: boolean | null;
  show_gift_section: boolean | null;
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
  couple_photo_url: string;
  akad_date: string;
  akad_venue: string;
  akad_address: string;
  reception_date: string;
  reception_venue: string;
  reception_address: string;
  greeting_text: string;
  quote_source: string;
  music_url: string;
  love_story: LoveStoryItem[];
  gallery_photos: string[];
  gift_bank_name: string;
  gift_bank_account: string;
  gift_bank_account_name: string;
  gift_shipping_address: string;
  sections_order: string[];
  sections_visibility: Record<string, boolean>;
  show_couple_photos: boolean;
  show_prewed_gallery: boolean;
  show_gift_section: boolean;
};

type ApiResponse<T> = {
  data: T | null;
  error: { code: string; message: string } | null;
};

type UploadResponse = {
  url: string;
  key: string;
};

type TabId = "mempelai" | "acara" | "cerita" | "galeri" | "amplop" | "pengaturan";

const tabs: Array<{ id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "mempelai", label: "Mempelai", icon: Users },
  { id: "acara", label: "Acara", icon: MapPin },
  { id: "cerita", label: "Cerita", icon: Heart },
  { id: "galeri", label: "Galeri", icon: Camera },
  { id: "amplop", label: "Amplop", icon: Gift },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
];

const defaultLoveStory: LoveStoryItem[] = [
  { year: "2020", title: "Pertama Bertemu", description: "" },
  { year: "2022", title: "Lamaran", description: "" },
  { year: "2026", title: "Hari Bahagia", description: "" },
];

const defaultSections = ["hero", "couple", "quote", "lovestory", "countdown", "event", "gallery", "gift", "rsvp", "music"];

function initialForm(data: InvitationEditorInitialData): EditorForm {
  return {
    status: data.status || "draft",
    slug: data.slug || "",
    groom_name: data.groom_nickname || "",
    bride_name: data.bride_nickname || "",
    groom_full_name: data.groom_full_name || "",
    bride_full_name: data.bride_full_name || "",
    groom_father: data.groom_father_name || "",
    groom_mother: data.groom_mother_name || "",
    bride_father: data.bride_father_name || "",
    bride_mother: data.bride_mother_name || "",
    couple_photo_url: data.couple_photo_url || "",
    akad_date: data.akad_datetime || "",
    akad_venue: data.akad_location_name || "",
    akad_address: data.akad_location_address || "",
    reception_date: data.resepsi_datetime || "",
    reception_venue: data.resepsi_location_name || "",
    reception_address: data.resepsi_location_address || "",
    greeting_text: data.quote_text || "",
    quote_source: data.quote_source || "Mempelai",
    music_url: data.music_url || "",
    love_story: data.love_story?.length ? data.love_story : defaultLoveStory,
    gallery_photos: data.gallery_photos || [],
    gift_bank_name: data.gift_bank_name || "",
    gift_bank_account: data.gift_bank_account || "",
    gift_bank_account_name: data.gift_bank_account_name || "",
    gift_shipping_address: data.gift_shipping_address || "",
    sections_order: data.sections_order || defaultSections,
    sections_visibility: data.sections_visibility || {},
    show_couple_photos: data.show_couple_photos ?? true,
    show_prewed_gallery: data.show_prewed_gallery ?? true,
    show_gift_section: data.show_gift_section ?? true,
  };
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block font-ui text-sm font-semibold text-landing-ink">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-md border border-landing-border bg-white px-3 font-ui text-sm text-landing-ink outline-none transition placeholder:text-landing-muted/60 focus:border-landing-gold focus:ring-2 focus:ring-landing-gold/20"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block font-ui text-sm font-semibold text-landing-ink">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-md border border-landing-border bg-white px-3 py-3 font-ui text-sm text-landing-ink outline-none transition placeholder:text-landing-muted/60 focus:border-landing-gold focus:ring-2 focus:ring-landing-gold/20"
      />
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-landing-border bg-white p-4 text-left"
    >
      <span>
        <span className="block font-ui text-sm font-bold text-landing-ink">{label}</span>
        <span className="mt-1 block font-ui text-xs leading-5 text-landing-muted">{description}</span>
      </span>
      <span className={cn("h-6 w-11 rounded-full p-1 transition", checked ? "bg-landing-maroon" : "bg-landing-border")}>
        <span className={cn("block h-4 w-4 rounded-full bg-white transition", checked && "translate-x-5")} />
      </span>
    </button>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-landing-border bg-white p-5 shadow-landing-card">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-landing-maroon text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="font-landing-serif text-2xl font-semibold text-landing-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function EditorClient({ initialData }: { initialData: InvitationEditorInitialData }) {
  const [formData, setFormData] = useState<EditorForm>(() => initialForm(initialData));
  const [activeTab, setActiveTab] = useState<TabId>("mempelai");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mobileMode, setMobileMode] = useState<"edit" | "preview">("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof EditorForm>(key: K, value: EditorForm[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const liveData = useMemo(() => {
    const groomNickname = formData.groom_name || "Mempelai Pria";
    const brideNickname = formData.bride_name || "Mempelai Wanita";

    return {
      ...demoData,
      coupleShortName: `${groomNickname} & ${brideNickname}`,
      coverPhoto: formData.couple_photo_url || demoData.coverPhoto,
      heroPhoto: formData.couple_photo_url || demoData.heroPhoto,
      groom: {
        ...demoData.groom,
        fullName: formData.groom_full_name || groomNickname,
        father: formData.groom_father ? `Bapak ${formData.groom_father}` : demoData.groom.father,
        mother: formData.groom_mother ? `Ibu ${formData.groom_mother}` : demoData.groom.mother,
        photo: formData.couple_photo_url || demoData.groom.photo,
      },
      bride: {
        ...demoData.bride,
        fullName: formData.bride_full_name || brideNickname,
        father: formData.bride_father ? `Bapak ${formData.bride_father}` : demoData.bride.father,
        mother: formData.bride_mother ? `Ibu ${formData.bride_mother}` : demoData.bride.mother,
      },
      akad: {
        ...demoData.akad,
        date: formData.akad_date || demoData.akad.date,
        venue: formData.akad_venue || demoData.akad.venue,
        address: formData.akad_address || demoData.akad.address,
      },
      reception: {
        ...demoData.reception,
        date: formData.reception_date || demoData.reception.date,
        venue: formData.reception_venue || demoData.reception.venue,
        address: formData.reception_address || demoData.reception.address,
      },
      quote: {
        text: formData.greeting_text || demoData.quote.text,
        source: formData.quote_source || demoData.quote.source,
      },
      loveStory: formData.love_story,
      gallery: formData.gallery_photos.length > 0 ? formData.gallery_photos : demoData.gallery,
      bankAccounts: formData.gift_bank_account
        ? [
            {
              bank: formData.gift_bank_name || "Bank",
              number: formData.gift_bank_account,
              name: formData.gift_bank_account_name || "Nama Pemilik Rekening",
            },
          ]
        : demoData.bankAccounts,
      giftAddress: formData.gift_shipping_address || demoData.giftAddress,
      musicUrl: formData.music_url || null,
      sectionsOrder: formData.sections_order,
      sectionsVisibility: formData.sections_visibility,
    };
  }, [formData]);

  async function handleSave(nextStatus?: string) {
    setIsSaving(true);
    const payload = nextStatus ? { ...formData, status: nextStatus } : formData;

    try {
      const response = await fetch(`/api/invitations/${initialData.id}`, {
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
    } catch (error) {
      console.error("[editor] save failed:", error);
      toast.error("Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpload(file: File | null) {
    if (!file) return;
    setIsUploading(true);

    const body = new FormData();
    body.set("file", file);
    body.set("invitation_id", initialData.id);
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

  function renderTab() {
    if (activeTab === "mempelai") {
      return (
        <Section title="Data Mempelai" icon={Users}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama panggilan pria" value={formData.groom_name} onChange={(value) => updateField("groom_name", value)} />
            <Field label="Nama panggilan wanita" value={formData.bride_name} onChange={(value) => updateField("bride_name", value)} />
            <Field label="Nama lengkap pria" value={formData.groom_full_name} onChange={(value) => updateField("groom_full_name", value)} />
            <Field label="Nama lengkap wanita" value={formData.bride_full_name} onChange={(value) => updateField("bride_full_name", value)} />
            <Field label="Ayah mempelai pria" value={formData.groom_father} onChange={(value) => updateField("groom_father", value)} />
            <Field label="Ibu mempelai pria" value={formData.groom_mother} onChange={(value) => updateField("groom_mother", value)} />
            <Field label="Ayah mempelai wanita" value={formData.bride_father} onChange={(value) => updateField("bride_father", value)} />
            <Field label="Ibu mempelai wanita" value={formData.bride_mother} onChange={(value) => updateField("bride_mother", value)} />
          </div>
        </Section>
      );
    }

    if (activeTab === "acara") {
      return (
        <Section title="Detail Acara" icon={MapPin}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tanggal dan waktu akad" type="datetime-local" value={formData.akad_date} onChange={(value) => updateField("akad_date", value)} />
            <Field label="Tanggal dan waktu resepsi" type="datetime-local" value={formData.reception_date} onChange={(value) => updateField("reception_date", value)} />
            <Field label="Lokasi akad" value={formData.akad_venue} onChange={(value) => updateField("akad_venue", value)} />
            <Field label="Lokasi resepsi" value={formData.reception_venue} onChange={(value) => updateField("reception_venue", value)} />
            <div className="md:col-span-2">
              <TextArea label="Alamat akad" value={formData.akad_address} onChange={(value) => updateField("akad_address", value)} />
            </div>
            <div className="md:col-span-2">
              <TextArea label="Alamat resepsi" value={formData.reception_address} onChange={(value) => updateField("reception_address", value)} />
            </div>
          </div>
        </Section>
      );
    }

    if (activeTab === "cerita") {
      return (
        <Section title="Cerita dan Kutipan" icon={Heart}>
          <div className="grid gap-4">
            <TextArea label="Kutipan pembuka" value={formData.greeting_text} onChange={(value) => updateField("greeting_text", value)} rows={4} />
            <Field label="Sumber kutipan" value={formData.quote_source} onChange={(value) => updateField("quote_source", value)} />
            <div className="grid gap-3">
              {formData.love_story.map((story, index) => (
                <div key={`${story.title}-${index}`} className="rounded-2xl border border-landing-border bg-landing-cream p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Waktu" value={story.year} onChange={(value) => updateStory(index, "year", value)} />
                    <Field label="Judul cerita" value={story.title} onChange={(value) => updateStory(index, "title", value)} />
                    <div className="md:col-span-2">
                      <TextArea label="Isi cerita" value={story.description} onChange={(value) => updateStory(index, "description", value)} rows={3} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      );
    }

    if (activeTab === "galeri") {
      return (
        <Section title="Foto dan Galeri" icon={Camera}>
          <div className="grid gap-5">
            <div className="rounded-2xl border border-landing-border bg-landing-cream p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
                  {formData.couple_photo_url ? (
                    <img src={formData.couple_photo_url} alt="Foto cover pasangan" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-landing-gold" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-ui text-sm font-bold text-landing-ink">Foto cover utama</p>
                  <p className="mt-1 font-ui text-xs leading-5 text-landing-muted">
                    Digunakan untuk cover, hero, dan kartu preview undangan.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-landing-maroon px-4 font-ui text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
                    Unggah Foto
                  </button>
                </div>
              </div>
            </div>
            <Toggle
              label="Tampilkan foto pasangan"
              description="Foto pasangan muncul di section mempelai."
              checked={formData.show_couple_photos}
              onChange={(value) => updateField("show_couple_photos", value)}
            />
            <Toggle
              label="Tampilkan galeri prewedding"
              description="Section galeri akan tampil di undangan publik."
              checked={formData.show_prewed_gallery}
              onChange={(value) => updateField("show_prewed_gallery", value)}
            />
          </div>
        </Section>
      );
    }

    if (activeTab === "amplop") {
      return (
        <Section title="Amplop Digital" icon={Gift}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama bank" value={formData.gift_bank_name} onChange={(value) => updateField("gift_bank_name", value)} />
            <Field label="Nomor rekening" value={formData.gift_bank_account} onChange={(value) => updateField("gift_bank_account", value)} />
            <Field label="Nama pemilik rekening" value={formData.gift_bank_account_name} onChange={(value) => updateField("gift_bank_account_name", value)} />
            <div className="md:col-span-2">
              <TextArea label="Alamat kirim hadiah" value={formData.gift_shipping_address} onChange={(value) => updateField("gift_shipping_address", value)} />
            </div>
            <div className="md:col-span-2">
              <Toggle
                label="Tampilkan amplop digital"
                description="Tamu dapat melihat rekening dan alamat hadiah di undangan."
                checked={formData.show_gift_section}
                onChange={(value) => updateField("show_gift_section", value)}
              />
            </div>
          </div>
        </Section>
      );
    }

    return (
      <Section title="Pengaturan Undangan" icon={Settings}>
        <div className="grid gap-4">
          <Field label="Slug undangan" value={formData.slug} onChange={(value) => updateField("slug", value)} />
          <Field label="URL musik" value={formData.music_url} onChange={(value) => updateField("music_url", value)} placeholder="https://..." />
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle
              label="Section cerita"
              description="Tampilkan kisah cinta di halaman undangan."
              checked={formData.sections_visibility.lovestory !== false}
              onChange={(value) => updateField("sections_visibility", { ...formData.sections_visibility, lovestory: value })}
            />
            <Toggle
              label="Section RSVP"
              description="Tamu dapat mengirim konfirmasi kehadiran."
              checked={formData.sections_visibility.rsvp !== false}
              onChange={(value) => updateField("sections_visibility", { ...formData.sections_visibility, rsvp: value })}
            />
          </div>
        </div>
      </Section>
    );
  }

  return (
    <div className="-m-5 min-h-screen bg-landing-cream md:-m-8">
      <header className="sticky top-0 z-30 border-b border-landing-border bg-landing-paper/95 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-md border border-landing-border bg-white text-landing-ink">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
            <div>
              <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-landing-gold">Editor Undangan</p>
              <h1 className="font-landing-serif text-2xl font-semibold text-landing-ink">
                {formData.groom_name || "Mempelai"} & {formData.bride_name || "Pasangan"}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMobileMode((mode) => (mode === "edit" ? "preview" : "edit"))}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-landing-border bg-white px-4 font-ui text-sm font-semibold text-landing-ink lg:hidden"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              {mobileMode === "edit" ? "Preview" : "Edit"}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-landing-border bg-white px-4 font-ui text-sm font-semibold text-landing-ink"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Salin Link
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-landing-maroon px-4 font-ui text-sm font-semibold text-white disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              Simpan
            </button>
            <button
              type="button"
              onClick={() => void handleSave("active")}
              disabled={isSaving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-landing-gold px-4 font-ui text-sm font-semibold text-white disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Publikasikan
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 p-4 lg:grid-cols-[260px_minmax(0,1fr)_390px] lg:p-6">
        <aside className={cn("rounded-3xl border border-landing-border bg-white p-3 shadow-landing-card", mobileMode === "preview" && "hidden lg:block")}>
          <div className="mb-3 rounded-2xl bg-landing-cream p-4">
            <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-landing-gold">Status</p>
            <div className="mt-2 flex items-center gap-2 font-ui text-sm font-semibold text-landing-ink">
              <span className={cn("h-2.5 w-2.5 rounded-full", formData.status === "active" ? "bg-emerald-500" : "bg-landing-gold")} />
              {formData.status === "active" ? "Aktif" : "Draft"}
            </div>
          </div>
          <nav className="grid gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 font-ui text-sm font-semibold transition",
                  activeTab === tab.id ? "bg-landing-maroon text-white" : "text-landing-ink hover:bg-landing-cream",
                )}
              >
                <tab.icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
                {activeTab === tab.id ? <Check className="ml-auto h-4 w-4" aria-hidden="true" /> : null}
              </button>
            ))}
          </nav>
        </aside>

        <div className={cn("grid content-start gap-5", mobileMode === "preview" && "hidden lg:grid")}>
          {renderTab()}
        </div>

        <aside className={cn("lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]", mobileMode === "edit" && "hidden lg:block")}>
          <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-landing-border bg-landing-ink p-3 shadow-landing-card">
            <div className="mb-3 flex items-center justify-between px-2 py-1">
              <div>
                <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-landing-gold">Live Preview</p>
                <p className="font-ui text-sm text-white/70">Tampilan tamu</p>
              </div>
              <Music className="h-5 w-5 text-white/50" aria-hidden="true" />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto rounded-[1.5rem] bg-white">
              <InvitationClientWrapper data={liveData} invitationId={initialData.id} />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

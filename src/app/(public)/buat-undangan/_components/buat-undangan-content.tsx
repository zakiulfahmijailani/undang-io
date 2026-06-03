/* Invitation wizard for /buat-undangan based on docs/design/buat-undangan — Invitation Wizard.png. */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Instagram,
  Leaf,
  Link2,
  MessageCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { toast } from "sonner";
import { fallbackThemes } from "@/components/landing/data";
import { ThemePreviewCard } from "@/components/landing/ThemePreviewCard";
import type { LandingTheme } from "@/components/landing/types";
import { cn } from "@/lib/utils";

export type ActiveTheme = {
  id: string;
  name: string;
  description: string | null;
  culturalCategory: string | null;
  thumbnailUrl: string | null;
  slug: string;
};

type WizardStep = 1 | 2 | 3;

type InvitationForm = {
  groomFullName: string;
  groomNickname: string;
  groomFather: string;
  groomMother: string;
  brideFullName: string;
  brideNickname: string;
  brideFather: string;
  brideMother: string;
  akadDate: string;
  akadTime: string;
  receptionDate: string;
  receptionTime: string;
  venue: string;
  address: string;
  mapsUrl: string;
  quote: string;
  guestMessage: string;
};

const PREVIEW_DURATION_MS = 25 * 60 * 1000;

const defaultForm: InvitationForm = {
  groomFullName: "Rizky Pratama",
  groomNickname: "Rizky",
  groomFather: "Bapak Ahmad",
  groomMother: "Ibu Siti Aisyah",
  brideFullName: "Amara Putri",
  brideNickname: "Amara",
  brideFather: "Bapak Budi Santoso",
  brideMother: "",
  akadDate: "2025-12-12",
  akadTime: "09:00",
  receptionDate: "2025-12-12",
  receptionTime: "19:00",
  venue: "Gedung Serbaguna Graha Indah",
  address: "Jl. Melati No. 10, Kebayoran Baru, Jakarta Selatan, DKI Jakarta",
  mapsUrl: "https://maps.app.goo.gl/example",
  quote:
    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri.",
  guestMessage:
    "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
};

const stepLabels = ["Pilih Tema", "Isi Data", "Pratinjau"] as const;

function generateSlug(groomNick: string, brideNick: string) {
  const clean = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  return `${clean(groomNick || "mempelai")}-${clean(brideNick || "pasangan")}`;
}

function toLandingTheme(theme: ActiveTheme): LandingTheme {
  return {
    id: theme.id,
    name: theme.name,
    slug: theme.slug,
    thumbnailUrl: theme.thumbnailUrl,
    culturalCategory: theme.culturalCategory,
  };
}

function fallbackActiveThemes(): ActiveTheme[] {
  return fallbackThemes.map((theme) => ({
    id: theme.id,
    name: theme.name,
    slug: theme.slug,
    thumbnailUrl: theme.thumbnailUrl,
    culturalCategory: theme.culturalCategory,
    description: null,
  }));
}

function normalizeCategory(category: string | null) {
  if (!category) return "Modern";
  return category
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function WizardHeader({ step, isLoggedIn }: { step: WizardStep; isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-landing-border bg-landing-paper/95 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center text-landing-maroon" aria-label="Beranda undang.io">
          <BrandLogo size="wizard" priority />
        </Link>

        <div className="hidden items-center justify-center gap-5 md:flex">
          {stepLabels.map((label, index) => {
            const stepNumber = (index + 1) as WizardStep;
            const isDone = stepNumber < step;
            const isCurrent = stepNumber === step;

            return (
              <div key={label} className="flex items-center gap-5">
                <div className="flex items-center gap-3 font-ui text-sm font-semibold">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border",
                      isDone && "border-landing-gold bg-white text-landing-gold",
                      isCurrent && "border-landing-maroon bg-landing-maroon text-white",
                      !isDone && !isCurrent && "border-landing-border bg-white text-landing-ink",
                    )}
                  >
                    {isDone ? <Check className="h-5 w-5" aria-hidden="true" /> : stepNumber}
                  </span>
                  <span className={cn(isCurrent ? "text-landing-maroon" : "text-landing-ink")}>{label}</span>
                </div>
                {index < stepLabels.length - 1 ? <span className="h-px w-20 bg-landing-border" /> : null}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 font-ui text-sm font-semibold">
          <Link href="/login" className="hidden text-landing-ink hover:text-landing-maroon sm:inline-flex">
            Masuk
          </Link>
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="rounded-md border border-landing-gold px-4 py-2 text-landing-ink transition hover:bg-landing-gold hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  icon,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  icon?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <label className="block font-ui text-xs font-semibold text-landing-ink">
      {label} {required ? <span className="text-landing-maroon">*</span> : null}
      <span className="relative mt-1.5 block">
        {icon ? <span className="absolute right-3 top-1/2 -translate-y-1/2 text-landing-muted">{icon}</span> : null}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-md border border-landing-border bg-white px-3 font-ui text-sm text-landing-ink outline-none transition placeholder:text-landing-muted/60 focus:border-landing-gold focus:ring-2 focus:ring-landing-gold/20",
            icon && "pr-10",
          )}
        />
      </span>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}) {
  return (
    <label className="block font-ui text-xs font-semibold text-landing-ink">
      {label} <span className="text-landing-muted">(maks. {maxLength} karakter)</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
        rows={4}
        className="mt-1.5 w-full resize-none rounded-md border border-landing-border bg-white px-3 py-2 font-ui text-sm text-landing-ink outline-none transition focus:border-landing-gold focus:ring-2 focus:ring-landing-gold/20"
      />
      <span className="mt-1 block text-right font-ui text-xs text-landing-muted">
        {value.length} / {maxLength}
      </span>
    </label>
  );
}

function InvitationPreview({ form, large = false }: { form: InvitationForm; large?: boolean }) {
  return (
    <div
      className={cn(
        "relative mx-auto overflow-hidden rounded-2xl border border-landing-border bg-landing-cream shadow-landing-card",
        large ? "aspect-[1.52/1] w-full max-w-[650px] p-10" : "aspect-[3/4] w-full max-w-[300px] p-8",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,26,43,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(201,168,76,0.12),transparent_35%)]" />
      <Leaf className="absolute left-5 top-5 h-20 w-20 text-landing-maroon/30" aria-hidden="true" />
      <Leaf className="absolute bottom-5 right-5 h-20 w-20 rotate-180 text-landing-maroon/30" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <p className="font-ui text-[10px] font-bold uppercase text-landing-muted">The Wedding Of</p>
        <h2 className={cn("mt-5 font-landing-serif leading-tight text-landing-ink", large ? "text-5xl" : "text-4xl")}>
          {form.groomNickname || "Rizky"}
          <span className="block font-display text-4xl text-landing-maroon">&amp;</span>
          {form.brideNickname || "Amara"}
        </h2>
        <p className="mt-4 font-ui text-xs font-semibold text-landing-muted">{form.akadDate || "12 . 12 . 2025"}</p>
        <div className="mt-8 grid w-full max-w-sm grid-cols-2 divide-x divide-landing-border font-ui text-xs text-landing-ink">
          <div>
            <p className="font-landing-serif text-lg">Akad Nikah</p>
            <p>{form.akadTime || "09:00"} WIB</p>
          </div>
          <div>
            <p className="font-landing-serif text-lg">Resepsi</p>
            <p>{form.receptionTime || "19:00"} WIB</p>
          </div>
        </div>
        <p className="mt-8 max-w-sm font-ui text-xs leading-5 text-landing-ink">
          {form.venue}
          <br />
          {form.address}
        </p>
        <p className="mt-8 max-w-md font-ui text-xs leading-5 text-landing-ink">{form.guestMessage}</p>
      </div>
    </div>
  );
}

export function BuatUndanganContent({ themes, isLoggedIn = false }: { themes: ActiveTheme[]; isLoggedIn?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeOptions = themes.length > 0 ? themes : fallbackActiveThemes();
  const [step, setStep] = useState<WizardStep>(1);
  const [selectedThemeId, setSelectedThemeId] = useState(themeOptions[0]?.id ?? "");
  const [form, setForm] = useState<InvitationForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const themeFromUrl = searchParams.get("theme");
    const match = themeOptions.find((theme) => theme.id === themeFromUrl || theme.slug === themeFromUrl);
    if (match) {
      setSelectedThemeId(match.id);
      setStep(2);
    }

    try {
      const raw = sessionStorage.getItem("undang_draft");
      if (raw) {
        const draft = JSON.parse(raw) as {
          groom_name?: string;
          groom_full_name?: string;
          bride_name?: string;
          bride_full_name?: string;
          themeId?: string;
        };
        setForm((previous) => ({
          ...previous,
          groomFullName: draft.groom_name || draft.groom_full_name || previous.groomFullName,
          groomNickname: draft.groom_name || previous.groomNickname,
          brideFullName: draft.bride_name || draft.bride_full_name || previous.brideFullName,
          brideNickname: draft.bride_name || previous.brideNickname,
        }));
        if (draft.themeId) {
          const draftTheme = themeOptions.find((theme) => theme.id === draft.themeId || theme.slug === draft.themeId);
          if (draftTheme) setSelectedThemeId(draftTheme.id);
        }
        sessionStorage.removeItem("undang_draft");
      }
    } catch (error) {
      console.error("[buat-undangan] Failed to read draft:", error);
    }
  }, [searchParams, themeOptions]);

  const selectedTheme = useMemo(
    () => themeOptions.find((theme) => theme.id === selectedThemeId) ?? themeOptions[0],
    [selectedThemeId, themeOptions],
  );

  function update(key: keyof InvitationForm, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleGuestPublish(slug: string) {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + PREVIEW_DURATION_MS).toISOString();

    const response = await fetch("/api/guest-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken, slug, themeId: selectedTheme?.id ?? null, expiresAt, invitationData: form }),
    });

    const json = (await response.json()) as { error?: { message?: string } };
    if (!response.ok) throw new Error(json.error?.message || "Gagal mempublikasikan undangan.");

    localStorage.setItem("guest_session", JSON.stringify({ sessionToken, slug, expiresAt }));
    localStorage.setItem("guest_return_slug", slug);
    toast.success("Undangan berhasil dipublikasikan!", {
      description: "Undangan kamu live selama 25 menit. Daftar untuk simpan selamanya.",
    });
    router.push(`/u/${slug}`);
  }

  async function handlePublish() {
    setIsSubmitting(true);
    const slug = generateSlug(form.groomNickname || form.groomFullName, form.brideNickname || form.brideFullName);

    try {
      if (isLoggedIn) {
        const response = await fetch("/api/invitations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, themeId: selectedTheme?.id ?? null, invitationData: form }),
        });

        if (response.ok) {
          toast.success("Undangan berhasil disimpan!", {
            description: "Kamu bisa mengedit dan mempublikasikan dari dashboard.",
          });
          router.push("/dashboard");
          return;
        }
      }

      await handleGuestPublish(slug);
    } catch (error) {
      console.error("[buat-undangan] Publish error:", error);
      toast.error("Gagal publikasi", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-landing-paper text-landing-ink">
      <WizardHeader step={step} isLoggedIn={isLoggedIn} />

      {step === 1 ? (
        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-10">
          <h1 className="font-landing-serif text-4xl font-semibold text-landing-maroon">Pilih Tema Undanganmu</h1>
          <p className="mt-1 font-ui text-sm text-landing-muted">Temukan tema yang mencerminkan kisah cintamu</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {themeOptions.map((theme, index) => (
              <button
                type="button"
                key={theme.id}
                onClick={() => setSelectedThemeId(theme.id)}
                className={cn(
                  "relative rounded-lg border bg-white p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-landing-card",
                  selectedThemeId === theme.id ? "border-landing-gold ring-2 ring-landing-gold/20" : "border-landing-border",
                )}
              >
                <ThemePreviewCard theme={toLandingTheme(theme)} index={index} />
                {selectedThemeId === theme.id ? (
                  <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-landing-gold text-white">
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
                <div className="px-2 py-3">
                  <h2 className="font-ui text-base font-bold text-landing-ink">{theme.name}</h2>
                  <p className="mt-1 font-ui text-sm text-landing-muted">
                    {normalizeCategory(theme.culturalCategory)} <span aria-hidden="true">-</span>{" "}
                    {theme.description || "Romantis"}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex h-12 items-center gap-2 rounded-md bg-landing-maroon px-7 font-ui text-sm font-bold text-white shadow-landing-button transition hover:bg-landing-maroon-dark"
            >
              Lanjut ke Isi Data
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </main>
      ) : null}

      {step === 2 ? (
        <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_520px]">
          <section className="border-r border-landing-border px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-3xl">
              <SectionTitle number="1" title="Identitas Pasangan" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Nama Mempelai Pria" required value={form.groomFullName} onChange={(value) => update("groomFullName", value)} />
                <Field label="Nama Mempelai Wanita" required value={form.brideFullName} onChange={(value) => update("brideFullName", value)} />
                <Field label="Nama Ayah Pria" required value={form.groomFather} onChange={(value) => update("groomFather", value)} />
                <Field label="Nama Ibu Pria" required value={form.groomMother} onChange={(value) => update("groomMother", value)} />
                <Field label="Nama Ayah Wanita" required value={form.brideFather} onChange={(value) => update("brideFather", value)} />
              </div>

              <SectionTitle number="2" title="Detail Acara" className="mt-6" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Tanggal Akad"
                  required
                  type="date"
                  value={form.akadDate}
                  onChange={(value) => update("akadDate", value)}
                  icon={<Calendar className="h-4 w-4" />}
                />
                <Field
                  label="Waktu Akad"
                  required
                  type="time"
                  value={form.akadTime}
                  onChange={(value) => update("akadTime", value)}
                  icon={<Clock3 className="h-4 w-4" />}
                />
                <Field
                  label="Tanggal Resepsi"
                  required
                  type="date"
                  value={form.receptionDate}
                  onChange={(value) => update("receptionDate", value)}
                  icon={<Calendar className="h-4 w-4" />}
                />
                <Field
                  label="Waktu Resepsi"
                  required
                  type="time"
                  value={form.receptionTime}
                  onChange={(value) => update("receptionTime", value)}
                  icon={<Clock3 className="h-4 w-4" />}
                />
                <div className="sm:col-span-2">
                  <Field label="Nama Venue" required value={form.venue} onChange={(value) => update("venue", value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-ui text-xs font-semibold text-landing-ink">
                    Alamat Lengkap <span className="text-landing-maroon">*</span>
                    <textarea
                      value={form.address}
                      onChange={(event) => update("address", event.target.value)}
                      rows={4}
                      className="mt-1.5 w-full resize-none rounded-md border border-landing-border bg-white px-3 py-2 font-ui text-sm text-landing-ink outline-none transition focus:border-landing-gold focus:ring-2 focus:ring-landing-gold/20"
                    />
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Link Google Maps (opsional)" value={form.mapsUrl} onChange={(value) => update("mapsUrl", value)} />
                </div>
              </div>

              <SectionTitle number="3" title="Pesan & Kutipan" className="mt-6" />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextArea label="Kutipan / Ayat" maxLength={200} value={form.quote} onChange={(value) => update("quote", value)} />
                <TextArea label="Pesan untuk Tamu" maxLength={300} value={form.guestMessage} onChange={(value) => update("guestMessage", value)} />
              </div>

              <button
                type="button"
                className="mt-6 flex w-full items-center justify-between border-t border-landing-border py-4 font-landing-serif text-xl text-landing-ink"
              >
                Bagian 4 - Informasi Tambahan <span className="font-ui text-xs text-landing-muted">(opsional)</span>
              </button>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-landing-maroon px-7 font-ui text-sm font-bold text-white shadow-landing-button transition hover:bg-landing-maroon-dark"
                >
                  Lihat Pratinjau
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>

          <aside className="hidden bg-landing-cream px-6 py-8 lg:block">
            <div className="mb-4 flex items-center gap-2 font-ui text-xs font-bold text-landing-success">
              <span className="h-2 w-2 rounded-full bg-landing-success" />
              LIVE
            </div>
            <InvitationPreview form={form} />
            <p className="mt-5 text-center font-ui text-sm text-landing-muted">Tema: {selectedTheme?.name ?? "Sakura"}</p>
            <p className="mt-10 border-t border-landing-border pt-4 text-center font-ui text-xs text-landing-muted">Langkah 2 dari 3</p>
          </aside>
        </main>
      ) : null}

      {step === 3 ? (
        <main className="grid min-h-[calc(100vh-4rem)] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-10">
          <section className="flex items-center">
            <InvitationPreview form={form} large />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-xl border border-landing-border bg-white p-6 shadow-sm">
              <h1 className="font-landing-serif text-2xl font-semibold text-landing-ink">Status Penyimpanan</h1>
              <label className="mt-5 flex items-center gap-2 font-ui text-sm text-landing-muted">
                <input type="checkbox" readOnly checked={isLoggedIn} className="h-4 w-4 rounded border-landing-border" />
                Saya sudah masuk
              </label>
              <div className="mt-4 rounded-lg border border-orange-300 bg-orange-50 p-4 font-ui text-sm text-orange-800">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <p>
                    Undangan ini bersifat sementara <strong>(25 menit)</strong>. Daftar atau masuk untuk menyimpan permanen.
                  </p>
                </div>
              </div>
              <p className="mt-5 font-ui text-sm text-landing-muted">Sisa waktu:</p>
              <div className="mt-1 font-ui text-5xl font-bold text-orange-600">25:00</div>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
                className="mt-5 h-12 w-full rounded-md bg-landing-maroon font-ui text-sm font-bold text-white shadow-landing-button transition hover:bg-landing-maroon-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Memproses..." : "🚀 Publikasikan Sekarang"}
              </button>
              {!isLoggedIn ? (
                <Link
                  href="/register"
                  className="mt-3 flex h-12 items-center justify-center rounded-md border border-landing-gold font-ui text-sm font-bold text-landing-ink transition hover:bg-landing-gold hover:text-white"
                >
                  Daftar untuk Menyimpan Permanen
                </Link>
              ) : null}
              <div className="mt-3 rounded-lg border border-landing-gold/40 bg-landing-gold/10 p-4 font-ui text-sm text-landing-ink">
                ⭐ Upgrade ke Premium Rp 49.000 untuk undangan permanen + semua fitur
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-md border border-landing-border px-4 font-ui text-sm font-semibold text-landing-ink"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Edit Data
              </button>
            </div>

            <div className="rounded-xl border border-landing-border bg-white p-6 shadow-sm">
              <h2 className="font-ui text-sm font-bold text-landing-ink">Link undangan kamu:</h2>
              <div className="mt-3 flex gap-2">
                <input
                  readOnly
                  value={`https://undang.io/u/${generateSlug(form.groomNickname, form.brideNickname)}`}
                  className="h-10 min-w-0 flex-1 rounded-md border border-landing-border px-3 font-ui text-sm text-landing-ink"
                />
                <button type="button" className="rounded-md border border-landing-gold px-3 font-ui text-sm font-semibold text-landing-gold">
                  Salin
                </button>
              </div>
              <h2 className="mt-8 font-ui text-sm font-bold text-landing-ink">Bagikan undanganmu</h2>
              <div className="mt-3 grid gap-3">
                {[
                  { label: "WhatsApp", icon: MessageCircle },
                  { label: "Instagram", icon: Instagram },
                  { label: "Copy Link", icon: Copy },
                  { label: "Link", icon: Link2 },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    className="flex h-12 items-center gap-4 rounded-lg border border-landing-border px-4 font-ui text-sm font-semibold text-landing-ink transition hover:border-landing-gold"
                  >
                    <item.icon className="h-5 w-5 text-landing-gold" aria-hidden="true" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
      ) : null}
    </div>
  );
}

function SectionTitle({ number, title, className }: { number: string; title: string; className?: string }) {
  return (
    <div className={cn("mb-3 flex items-center gap-4", className)}>
      <h2 className="font-landing-serif text-xl font-semibold text-landing-ink">
        Bagian {number} - {title}
      </h2>
      <span className="h-px flex-1 bg-landing-border" />
    </div>
  );
}

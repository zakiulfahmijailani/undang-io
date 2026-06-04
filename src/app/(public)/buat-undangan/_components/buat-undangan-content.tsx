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
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  Instagram,
  Leaf,
  Link2,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { toast } from "sonner";
import { fallbackThemes } from "@/components/landing/data";
import { ThemePreviewCard } from "@/components/landing/ThemePreviewCard";
import type { LandingTheme } from "@/components/landing/types";
import {
  DEFAULT_INVITATION_THEME_KEY,
  DEFAULT_INVITATION_THEME_NAME,
  OBSIDIAN_LUXE_THEME_KEY,
  PETAL_SOFT_THEME_KEY,
  isCodeRenderedThemeKey,
} from "@/lib/default-theme";
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
  groomFullName: "",
  groomNickname: "",
  groomFather: "",
  groomMother: "",
  brideFullName: "",
  brideNickname: "",
  brideFather: "",
  brideMother: "",
  akadDate: "",
  akadTime: "",
  receptionDate: "",
  receptionTime: "",
  venue: "",
  address: "",
  mapsUrl: "",
  quote: "",
  guestMessage: "",
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

function mergeActiveThemes(primary: ActiveTheme[], secondary: ActiveTheme[]) {
  const seen = new Set<string>();
  return [...primary, ...secondary].filter((theme) => {
    const key = theme.slug || theme.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function themeSelectionValue(theme: ActiveTheme) {
  return isCodeRenderedThemeKey(theme.slug) ? theme.slug : theme.id;
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

import { useRef } from "react";

function InvitationPreview({ form, themeSlug, large = false }: { form: InvitationForm; themeSlug?: string; large?: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "UPDATE_PREVIEW", data: form }, "*");
    }
  }, [form]);

  return (
    <div
      className={cn(
        "relative mx-auto overflow-hidden rounded-2xl border border-landing-border shadow-landing-card bg-landing-cream",
        large ? "aspect-[1.52/1] w-full max-w-[650px]" : "aspect-[3/4] w-full max-w-[300px]",
      )}
    >
      <iframe
        ref={iframeRef}
        src={`/invite/demo?preview=true&theme=${themeSlug || "sakinah-serenity"}`}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

export function BuatUndanganContent({ themes, isLoggedIn = false }: { themes: ActiveTheme[]; isLoggedIn?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeOptions = useMemo(() => mergeActiveThemes(fallbackActiveThemes(), themes), [themes]);
  const [step, setStep] = useState<WizardStep>(1);
  const [selectedThemeId, setSelectedThemeId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedPrice, setSelectedPrice] = useState("Semua");
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
    () => themeOptions.find((theme) => theme.id === selectedThemeId),
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
      body: JSON.stringify({ sessionToken, slug, themeId: selectedTheme ? themeSelectionValue(selectedTheme) : null, expiresAt, invitationData: form }),
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
          body: JSON.stringify({ slug, themeId: selectedTheme ? themeSelectionValue(selectedTheme) : null, invitationData: form }),
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
          <div className="mb-8">
            <h1 className="font-landing-serif text-4xl font-semibold text-[#14213D]">Pilih Tema Undanganmu</h1>
            <p className="mt-1 font-ui text-lg text-gray-500">Sesuaikan tampilan undangan sesuai dengan konsep perayaan Anda.</p>
          </div>

          <div className="mb-8 flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row">
            <div className="flex flex-col gap-2">
              <span className="font-ui text-xs font-bold uppercase tracking-wider text-gray-500">Kategori Tema</span>
              <div className="flex flex-wrap gap-2">
                {["Semua", "Elegan", "Minimalis", "Jawa", "Sunda", "Modern", "Romantis"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "rounded-full px-4 py-1.5 font-ui text-sm font-medium transition-colors",
                      selectedCategory === cat ? "bg-[#14213D] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <span className="font-ui text-xs font-bold uppercase tracking-wider text-gray-500">Harga</span>
              <div className="flex gap-2">
                {["Semua", "Gratis", "Premium"].map((price) => (
                  <button
                    key={price}
                    onClick={() => setSelectedPrice(price)}
                    className={cn(
                      "rounded-full px-4 py-1.5 font-ui text-sm font-medium transition-colors",
                      selectedPrice === price ? "bg-[#FCA311] text-[#14213D]" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    )}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {themeOptions
              .filter((theme) => {
                const themeCategory = theme.id === DEFAULT_INVITATION_THEME_KEY ? "Elegan" : normalizeCategory(theme.culturalCategory);
                const matchCategory = selectedCategory === "Semua" || themeCategory === selectedCategory;
                const matchPrice = selectedPrice === "Semua" || selectedPrice === "Gratis";
                return matchCategory && matchPrice;
              })
              .map((theme) => (
                <Card
                  key={theme.id}
                  className="group flex flex-col overflow-hidden border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gray-100">
                    {theme.thumbnailUrl ? (
                      <img src={theme.thumbnailUrl} alt={theme.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : theme.id === DEFAULT_INVITATION_THEME_KEY ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#EFF7FB] via-[#DCECF5] to-[#C9DDEB]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.86),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(195,163,107,0.28),transparent_38%)]" />
                        <div className="absolute left-6 top-8 h-24 w-24 rounded-full border border-[#C3A36B]/35 bg-white/25 blur-sm" />
                        <div className="absolute bottom-8 right-8 h-28 w-28 rounded-full border border-white/50 bg-white/20 blur-sm" />
                        <div className="relative flex h-52 w-40 flex-col items-center justify-center rounded-[32px] border border-[#C3A36B]/45 bg-white/45 px-5 text-center shadow-[0_18px_50px_rgba(66,94,112,0.16)] backdrop-blur-sm">
                          <span className="font-serif text-5xl font-semibold text-[#8A6F42]">SS</span>
                          <span className="mt-3 h-px w-12 bg-[#C3A36B]/70" />
                          <span className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#536979]">Sakinah</span>
                        </div>
                      </>
                    ) : theme.id === PETAL_SOFT_THEME_KEY || theme.slug === PETAL_SOFT_THEME_KEY ? (
                      <>
                        <div className="absolute inset-0 bg-[#FDFAF8]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,218,219,0.95),transparent_34%),radial-gradient(circle_at_bottom,rgba(168,197,160,0.34),transparent_44%)]" />
                        <img src="/themes/petal-soft/floral-corner.png" alt="" className="absolute -left-16 -top-10 w-72 object-contain" loading="lazy" />
                        <img src="/themes/petal-soft/floral-corner.png" alt="" className="absolute -right-16 -top-10 w-72 scale-x-[-1] object-contain" loading="lazy" />
                        <img src="/themes/petal-soft/floral-bottom.png" alt="" className="absolute -bottom-10 left-1/2 w-[30rem] max-w-none -translate-x-1/2 object-contain opacity-90" loading="lazy" />
                        <div className="relative flex h-52 w-40 flex-col items-center justify-center rounded-[28px] border border-[#E9C9C9] bg-white/58 px-5 text-center shadow-[0_18px_50px_rgba(196,145,155,0.16)] backdrop-blur-sm">
                          <span className="font-landing-serif text-5xl font-semibold leading-none text-[#C4919B]">Petal</span>
                          <span className="font-landing-serif text-5xl font-semibold leading-none text-[#C4919B]">Soft</span>
                          <span className="mt-4 h-px w-14 bg-[#C4919B]/55" />
                          <span className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#9E8E8E]">Floral Pastel</span>
                        </div>
                      </>
                    ) : theme.id === OBSIDIAN_LUXE_THEME_KEY || theme.slug === OBSIDIAN_LUXE_THEME_KEY ? (
                      <>
                        <div className="absolute inset-0 bg-[#0A0A0A]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.22),transparent_38%),radial-gradient(circle_at_bottom,rgba(232,213,163,0.1),transparent_44%)]" />
                        <div className="absolute inset-5 border border-[#C9A84C]/30" />
                        <div className="absolute left-8 top-8 h-16 w-16 border-l border-t border-[#C9A84C]/45" />
                        <div className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#C9A84C]/45" />
                        <div className="relative flex h-52 w-40 flex-col items-center justify-center border border-[#C9A84C]/45 bg-[#0F0F1A]/78 px-5 text-center shadow-[0_22px_70px_rgba(0,0,0,0.45)]">
                          <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A8070]">Luxury</span>
                          <span className="mt-5 font-landing-serif text-5xl font-semibold italic leading-none text-[#C9A84C]">Obsidian</span>
                          <span className="font-landing-serif text-5xl font-semibold italic leading-none text-[#E8D5A3]">Luxe</span>
                          <span className="mt-5 h-px w-16 bg-[#C9A84C]/65" />
                          <span className="mt-4 font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">Dark Gold</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent opacity-10" />
                        <div className="z-10 flex h-32 w-24 -rotate-12 transform items-center justify-center rounded-sm border-2 border-white/20">
                          <span className="-rotate-12 transform font-serif text-lg font-bold italic tracking-widest text-white/40">
                            umuman
                          </span>
                        </div>
                      </>
                    )}
                    <div className="absolute right-3 top-3 flex gap-2">
                      <Badge className="border border-gray-200 bg-white text-gray-700 shadow-md hover:bg-gray-100">Gratis</Badge>
                    </div>
                  </div>

                  <CardContent className="flex flex-1 flex-col p-5">
                    <span className="mb-1 block font-ui text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {theme.id === DEFAULT_INVITATION_THEME_KEY ? "Elegan" : normalizeCategory(theme.culturalCategory)}
                    </span>
                    <h3 className="mb-4 font-landing-serif text-xl font-bold text-[#14213D]">{theme.name}</h3>

                    <div className="mt-auto flex flex-col gap-2">
                      <Link href={`/invite/demo?preview=true&theme=${theme.slug || theme.id}`} className="w-full" target="_blank">
                        <Button variant="secondary" className="w-full gap-2 border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
                          <Eye className="h-4 w-4" /> Live Preview
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          setSelectedThemeId(theme.id);
                          setStep(2);
                        }}
                        className="group w-full gap-2 bg-[#14213D] text-white transition-all hover:bg-[#1a2b50] hover:text-[#14213D] group-hover:bg-[#FCA311]"
                      >
                        Pilih Tema Ini <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {themeOptions.filter((theme) => {
              const themeCategory = theme.id === DEFAULT_INVITATION_THEME_KEY ? "Elegan" : normalizeCategory(theme.culturalCategory);
              const matchCategory = selectedCategory === "Semua" || themeCategory === selectedCategory;
              const matchPrice = selectedPrice === "Semua" || selectedPrice === "Gratis";
              return matchCategory && matchPrice;
            }).length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-gray-50 py-20 text-center">
                <h3 className="font-landing-serif text-xl font-bold text-gray-800">Tema Tidak Ditemukan</h3>
                <p className="mt-2 font-ui text-gray-500">Coba ubah filter kategori atau harga yang Anda pilih.</p>
                <Button
                  variant="secondary"
                  className="mt-4 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCategory("Semua");
                    setSelectedPrice("Semua");
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </main>
      ) : null}

      {step === 2 ? (
        <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_520px]">
          <section className="border-r border-landing-border px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-3xl">
              <SectionTitle number="1" title="Identitas Pasangan" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <Field label="Nama Lengkap Pria" required value={form.groomFullName} onChange={(value) => update("groomFullName", value)} />
                <Field label="Nama Lengkap Wanita" required value={form.brideFullName} onChange={(value) => update("brideFullName", value)} />
                <Field label="Panggilan Pria" required value={form.groomNickname} onChange={(value) => update("groomNickname", value)} />
                <Field label="Panggilan Wanita" required value={form.brideNickname} onChange={(value) => update("brideNickname", value)} />
                <Field label="Nama Ayah Pria" value={form.groomFather} onChange={(value) => update("groomFather", value)} />
                <Field label="Nama Ibu Pria" value={form.groomMother} onChange={(value) => update("groomMother", value)} />
                <Field label="Nama Ayah Wanita" value={form.brideFather} onChange={(value) => update("brideFather", value)} />
                <Field label="Nama Ibu Wanita" value={form.brideMother} onChange={(value) => update("brideMother", value)} />
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
            <InvitationPreview form={form} themeSlug={selectedTheme?.slug} />
            <p className="mt-5 text-center font-ui text-sm text-landing-muted">Tema: {selectedTheme?.name ?? DEFAULT_INVITATION_THEME_NAME}</p>
            <p className="mt-10 border-t border-landing-border pt-4 text-center font-ui text-xs text-landing-muted">Langkah 2 dari 3</p>
          </aside>
        </main>
      ) : null}

      {step === 3 ? (
        <main className="grid min-h-[calc(100vh-4rem)] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-10">
          <section className="flex items-center">
            <InvitationPreview form={form} themeSlug={selectedTheme?.slug} large />
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

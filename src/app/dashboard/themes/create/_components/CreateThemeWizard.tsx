/* Client wizard for /dashboard/themes/create based on docs/design/dashboardthemescreate — Create New Theme Page.png. */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createTheme } from "@/app/dashboard/themes/actions";
import { UniversalThemePreview } from "@/components/admin/UniversalThemePreview";
import { LivePreviewWorkspace } from "@/components/preview/LivePreviewWorkspace";
import {
  DEFAULT_INVITATION_THEME_KEY,
  JAWA_AGUNG_THEME_KEY,
  OBSIDIAN_LUXE_THEME_KEY,
  PETAL_SOFT_THEME_KEY,
} from "@/lib/default-theme";
import { cn } from "@/lib/utils";

const categories = ["modern", "jawa", "sunda", "minang", "internasional"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export function CreateThemeWizard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [isPremium, setIsPremium] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const generatedSlug = useMemo(() => slug || slugify(name), [name, slug]);
  const previewThemeKey = useMemo(() => {
    if (category === "jawa") return JAWA_AGUNG_THEME_KEY;
    if (category === "internasional") return OBSIDIAN_LUXE_THEME_KEY;
    if (category === "modern") return PETAL_SOFT_THEME_KEY;
    return DEFAULT_INVITATION_THEME_KEY;
  }, [category]);
  const previewData = useMemo(
    () => ({
      groomFullName: "Rizky Pratama",
      groomNickname: "Rizky",
      brideFullName: "Amara Putri",
      brideNickname: "Amara",
      akadDate: "2026-08-15",
      akadTime: "10:00",
      receptionDate: "2026-08-15",
      receptionTime: "19:00",
      venue: "The Grand Ballroom, Jakarta",
      address: "Jakarta, Indonesia",
      quote: "Bersama keluarga besar kami, dengan penuh kebahagiaan mengundang Anda.",
    }),
    [],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("display_name", name);
    formData.set("theme_key", generatedSlug);

    try {
      const result = await createTheme(formData);
      if (!result.success || !result.data) {
        toast.error(result.error || "Tema gagal dibuat.");
        return;
      }

      toast.success("Tema berhasil dibuat.", {
        description: "Lanjutkan dengan mengunggah aset dan mengatur detail tema.",
      });
      router.push(`/dashboard/themes/${result.data.slug || generatedSlug}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LivePreviewWorkspace
      className="min-h-[calc(100dvh-10rem)] overflow-hidden rounded-xl border border-landing-border"
      form={
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
      <section className="rounded-3xl border border-landing-border bg-white p-6 shadow-landing-card lg:p-8">
        <div className="grid gap-5 md:grid-cols-3">
          {["Identitas", "Gaya Visual", "Aset Awal"].map((label, index) => (
            <div
              key={label}
              className={cn(
                "rounded-2xl border p-4",
                index === 0 ? "border-landing-maroon bg-landing-maroon text-white" : "border-landing-border bg-landing-cream text-landing-ink",
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-ui text-sm font-bold">
                {index === 0 ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
              </span>
              <p className="mt-4 font-ui text-sm font-bold">{label}</p>
              <p className={cn("mt-1 font-ui text-xs", index === 0 ? "text-white/75" : "text-landing-muted")}>
                {index === 0 ? "Nama dan slug tema." : "Dilanjutkan setelah tema tersimpan."}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="block font-ui text-sm font-semibold text-landing-ink">
            Nama Tema
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contoh: Javanese Gold"
              className="mt-2 h-11 w-full rounded-md border border-landing-border bg-white px-3 font-ui text-sm outline-none transition focus:border-landing-gold focus:ring-2 focus:ring-landing-gold/20"
            />
          </label>
          <label className="block font-ui text-sm font-semibold text-landing-ink">
            Slug Tema
            <input
              required
              value={generatedSlug}
              onChange={(event) => setSlug(slugify(event.target.value))}
              placeholder="javanese_gold"
              className="mt-2 h-11 w-full rounded-md border border-landing-border bg-white px-3 font-ui text-sm outline-none transition focus:border-landing-gold focus:ring-2 focus:ring-landing-gold/20"
            />
          </label>
        </div>

        <div className="mt-6">
          <p className="font-ui text-sm font-semibold text-landing-ink">Kategori Budaya</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "rounded-full border px-4 py-2 font-ui text-sm font-semibold capitalize transition",
                  category === item
                    ? "border-landing-maroon bg-landing-maroon text-white"
                    : "border-landing-border bg-white text-landing-ink hover:border-landing-gold",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-6 flex items-center justify-between rounded-2xl border border-landing-border bg-landing-cream p-4">
          <span>
            <span className="block font-ui text-sm font-bold text-landing-ink">Tandai sebagai tema premium</span>
            <span className="mt-1 block font-ui text-xs text-landing-muted">Metadata ini bisa disempurnakan di halaman detail.</span>
          </span>
          <button
            type="button"
            onClick={() => setIsPremium((value) => !value)}
            className={cn("h-6 w-11 rounded-full p-1 transition", isPremium ? "bg-landing-gold" : "bg-landing-border")}
            aria-pressed={isPremium}
          >
            <span className={cn("block h-4 w-4 rounded-full bg-white transition", isPremium && "translate-x-5")} />
          </button>
        </label>

        <button
          type="submit"
          disabled={isSubmitting || generatedSlug.length < 3}
          className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-landing-maroon px-5 font-ui text-sm font-semibold text-white shadow-sm transition hover:bg-landing-maroon/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          Simpan dan Lanjutkan
        </button>
      </section>
      </form>
      }
      preview={
        <UniversalThemePreview
          themeKey={previewThemeKey}
          data={previewData}
          themeOverrides={{ name: name || "Tema Baru", config: { category, isPremium } }}
          label={name ? `Pratinjau ${name}` : "Pratinjau tema baru"}
          className="h-full"
        />
      }
    />
  );
}

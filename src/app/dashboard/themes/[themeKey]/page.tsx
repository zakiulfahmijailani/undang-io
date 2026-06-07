/* Admin theme detail editor for /dashboard/themes/[themeKey] based on docs/design/dashboardthemes[themeKey] — Theme Detail & Editor Page.png. */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Eye, Image as ImageIcon, Layers3, Music, Palette, Settings, Sparkles, Upload } from "lucide-react";
import { UniversalThemePreview } from "@/components/admin/UniversalThemePreview";
import { LivePreviewWorkspace } from "@/components/preview/LivePreviewWorkspace";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type ThemeAsset = {
  id: string;
  slot: string | null;
  file_url: string | null;
};

type ThemeRow = {
  id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  is_active: boolean | null;
  is_premium: boolean | null;
  cultural_category: string | null;
  thumbnail_url: string | null;
  preview_url: string | null;
  music_url: string | null;
  theme_assets?: ThemeAsset[] | null;
};

const slots = [
  "cover_scene",
  "hero_background",
  "floral_top",
  "floral_bottom",
  "couple_frame",
  "gallery_frame",
  "event_card",
  "gift_card",
];

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "owner"].includes(profile.role)) redirect("/dashboard");

  return supabase;
}

function prettySlot(slot: string) {
  return slot
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function ThemeDetailPage({ params }: { params: Promise<{ themeKey: string }> }) {
  const { themeKey } = await params;
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from("themes")
    .select("id, name, slug, description, is_active, is_premium, cultural_category, thumbnail_url, preview_url, music_url, theme_assets (id, slot, file_url)")
    .eq("slug", themeKey)
    .single();

  if (error || !data) {
    console.error("[dashboard/themes/detail] Error fetching theme:", error);
    notFound();
  }

  const theme = data as ThemeRow;
  const assets = theme.theme_assets ?? [];
  const coverAsset = assets.find((asset) => asset.slot === "cover_scene");
  const themeName = theme.name || "Tema tanpa nama";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-7 pb-10">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <Link href="/dashboard/themes" className="inline-flex items-center gap-2 font-ui text-sm font-semibold text-landing-muted hover:text-landing-maroon">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke daftar tema
          </Link>
          <h1 className="mt-4 font-landing-serif text-4xl font-semibold text-landing-ink">{themeName}</h1>
          <p className="mt-2 max-w-2xl font-ui text-sm leading-6 text-landing-muted">
            Edit metadata tema, pantau kelengkapan aset, dan buka pratinjau sebelum tema diterbitkan.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/themes/${themeKey}/assets`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-landing-maroon px-4 font-ui text-sm font-semibold text-white transition hover:bg-landing-maroon/90"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Kelola Aset
          </Link>
          <Link
            href={`/dashboard/themes/${themeKey}/preview`}
            target="_blank"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-landing-border bg-white px-4 font-ui text-sm font-semibold text-landing-ink transition hover:border-landing-gold hover:text-landing-maroon"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Pratinjau
          </Link>
        </div>
      </div>

      <LivePreviewWorkspace
        className="min-h-[calc(100dvh-12rem)] overflow-hidden rounded-xl border border-landing-border"
        form={
        <div className="grid gap-6 p-4 sm:p-6">
        <aside className="rounded-3xl border border-landing-border bg-white p-5 shadow-landing-card">
          <div className="relative aspect-[9/12] overflow-hidden rounded-2xl bg-landing-cream">
            {coverAsset?.file_url ? (
              <img src={coverAsset.file_url} alt={themeName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-landing-muted">
                <ImageIcon className="h-10 w-10 text-landing-gold" aria-hidden="true" />
                <p className="mt-3 font-ui text-sm">Cover belum diunggah</p>
              </div>
            )}
            <div className="absolute left-4 top-4 flex gap-2">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 font-ui text-xs font-bold",
                  theme.is_active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-landing-border bg-white text-landing-muted",
                )}
              >
                {theme.is_active ? "Aktif" : "Draft"}
              </span>
              {theme.is_premium ? (
                <span className="rounded-full bg-landing-gold px-3 py-1 font-ui text-xs font-bold text-white">Premium</span>
              ) : null}
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              { label: "Slug", value: theme.slug || themeKey, icon: Settings },
              { label: "Kategori", value: theme.cultural_category || "Universal", icon: Palette },
              { label: "Musik", value: theme.music_url ? "Tersedia" : "Belum ada", icon: Music },
              { label: "Aset", value: `${assets.length} item`, icon: Layers3 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-landing-border bg-landing-cream p-3">
                <span className="flex items-center gap-2 font-ui text-sm font-semibold text-landing-ink">
                  <item.icon className="h-4 w-4 text-landing-gold" aria-hidden="true" />
                  {item.label}
                </span>
                <span className="font-ui text-sm text-landing-muted">{item.value}</span>
              </div>
            ))}
          </div>
        </aside>

          <section className="rounded-3xl border border-landing-border bg-white p-6 shadow-landing-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-landing-maroon text-white">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-landing-serif text-2xl font-semibold text-landing-ink">Informasi Tema</h2>
                <p className="font-ui text-sm text-landing-muted">Ringkasan metadata yang sedang tersimpan di database.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-landing-border bg-landing-cream p-4">
                <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-landing-gold">Nama</p>
                <p className="mt-2 font-ui text-lg font-semibold text-landing-ink">{themeName}</p>
              </div>
              <div className="rounded-2xl border border-landing-border bg-landing-cream p-4">
                <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-landing-gold">Preview URL</p>
                <p className="mt-2 truncate font-ui text-sm text-landing-muted">{theme.preview_url || "Belum diisi"}</p>
              </div>
              <div className="rounded-2xl border border-landing-border bg-landing-cream p-4 md:col-span-2">
                <p className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-landing-gold">Deskripsi</p>
                <p className="mt-2 font-ui text-sm leading-6 text-landing-muted">{theme.description || "Deskripsi tema belum diisi."}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-landing-border bg-white p-6 shadow-landing-card">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-landing-serif text-2xl font-semibold text-landing-ink">Slot Aset Utama</h2>
                <p className="font-ui text-sm text-landing-muted">Cek cepat slot visual yang paling penting untuk renderer undangan.</p>
              </div>
              <Link href={`/dashboard/themes/${themeKey}/assets`} className="font-ui text-sm font-semibold text-landing-maroon hover:text-landing-gold">
                Buka uploader
              </Link>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {slots.map((slot) => {
                const asset = assets.find((item) => item.slot === slot);
                return (
                  <div key={slot} className="flex items-center justify-between rounded-xl border border-landing-border p-3">
                    <span className="font-ui text-sm font-semibold text-landing-ink">{prettySlot(slot)}</span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 font-ui text-xs font-bold",
                        asset ? "bg-emerald-50 text-emerald-700" : "bg-landing-cream text-landing-muted",
                      )}
                    >
                      {asset ? "Terisi" : "Kosong"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
        }
        preview={
          <UniversalThemePreview
            themeKey={theme.slug || themeKey}
            src={`/dashboard/themes/${themeKey}/preview`}
            label={`Pratinjau ${themeName}`}
            className="h-full"
          />
        }
      />
    </div>
  );
}

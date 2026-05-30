/* Admin theme list for /dashboard/themes based on docs/design/dashboardthemes — Theme List Management Page.png. */

import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Eye, Image as ImageIcon, Layers3, Plus, Search, Sparkles } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Kelola Tema — undang.io Dashboard",
};

type ThemeAsset = {
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
  created_at: string | null;
  theme_assets?: ThemeAsset[] | null;
};

const totalSlots = 16;

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

function normalizeCategory(category: string | null) {
  if (!category) return "Universal";
  return category
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function DashboardThemesPage() {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from("themes")
    .select("id, name, slug, description, is_active, is_premium, cultural_category, created_at, theme_assets (slot, file_url)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[dashboard/themes] Error fetching themes:", error);
  }

  const themes = (data ?? []) as ThemeRow[];
  const activeThemes = themes.filter((theme) => theme.is_active).length;
  const premiumThemes = themes.filter((theme) => theme.is_premium).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-7 pb-10">
      <section className="rounded-3xl border border-landing-border bg-landing-paper p-6 shadow-landing-card lg:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-landing-gold/30 bg-landing-gold/10 px-3 py-1 font-ui text-xs font-semibold text-landing-ink">
              <Sparkles className="h-3.5 w-3.5 text-landing-gold" aria-hidden="true" />
              Studio Tema
            </span>
            <h1 className="mt-4 font-landing-serif text-4xl font-semibold text-landing-ink">Kelola Tema Undangan</h1>
            <p className="mt-2 max-w-2xl font-ui text-sm leading-6 text-landing-muted">
              Atur katalog tema, status publikasi, aset visual, dan varian premium dari satu dashboard admin.
            </p>
          </div>
          <Link
            href="/dashboard/themes/create"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-landing-maroon px-5 font-ui text-sm font-semibold text-white shadow-sm transition hover:bg-landing-maroon/90"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Buat Tema Baru
          </Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            { label: "Total Tema", value: themes.length, icon: Layers3 },
            { label: "Tema Aktif", value: activeThemes, icon: CheckCircle2 },
            { label: "Tema Premium", value: premiumThemes, icon: Sparkles },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-landing-border bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-ui text-sm font-medium text-landing-muted">{stat.label}</p>
                <stat.icon className="h-5 w-5 text-landing-gold" aria-hidden="true" />
              </div>
              <p className="mt-2 font-ui text-3xl font-bold text-landing-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-landing-border bg-white p-5 shadow-landing-card">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-landing-serif text-2xl font-semibold text-landing-ink">Daftar Tema</h2>
            <p className="font-ui text-sm text-landing-muted">Pilih tema untuk mengedit metadata atau mengelola aset.</p>
          </div>
          <div className="flex h-10 items-center gap-2 rounded-md border border-landing-border bg-landing-cream px-3 font-ui text-sm text-landing-muted md:w-72">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>Cari tema...</span>
          </div>
        </div>

        {themes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-landing-gold/50 bg-landing-cream p-10 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-landing-gold" aria-hidden="true" />
            <p className="mt-4 font-ui text-sm font-semibold text-landing-ink">Belum ada tema.</p>
            <p className="mt-1 font-ui text-sm text-landing-muted">Buat tema pertama untuk mulai mengisi katalog.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {themes.map((theme) => {
              const assets = theme.theme_assets ?? [];
              const assetCount = assets.length;
              const progressPct = Math.round((assetCount / totalSlots) * 100);
              const coverAsset = assets.find((asset) => asset.slot === "cover_scene");
              const themeName = theme.name || "Tema tanpa nama";
              const themeSlug = theme.slug || theme.id;

              return (
                <article key={theme.id} className="overflow-hidden rounded-2xl border border-landing-border bg-white shadow-sm">
                  <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-landing-cream">
                    {coverAsset?.file_url ? (
                      <img src={coverAsset.file_url} alt={themeName} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-landing-muted">
                        <ImageIcon className="h-8 w-8" aria-hidden="true" />
                        <span className="font-ui text-xs">Belum ada cover</span>
                      </div>
                    )}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 font-ui text-[11px] font-bold",
                          theme.is_active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-landing-border bg-white text-landing-muted",
                        )}
                      >
                        {theme.is_active ? "Aktif" : "Draft"}
                      </span>
                      {theme.is_premium ? (
                        <span className="rounded-full border border-landing-gold/40 bg-landing-gold px-2.5 py-1 font-ui text-[11px] font-bold text-white">
                          Premium
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-landing-gold">
                      {normalizeCategory(theme.cultural_category)}
                    </p>
                    <h3 className="mt-2 truncate font-landing-serif text-2xl font-semibold text-landing-ink" title={themeName}>
                      {themeName}
                    </h3>
                    <p className="mt-1 truncate font-ui text-xs text-landing-muted">{themeSlug}</p>
                    <p className="mt-3 line-clamp-2 min-h-10 font-ui text-sm leading-5 text-landing-muted">
                      {theme.description || "Deskripsi tema belum diisi."}
                    </p>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between font-ui text-xs">
                        <span className="text-landing-muted">Kelengkapan Aset</span>
                        <span className="font-semibold text-landing-ink">
                          {assetCount}/{totalSlots}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-landing-cream">
                        <div className="h-full rounded-full bg-landing-gold" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                      <Link
                        href={`/dashboard/themes/${themeSlug}`}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-landing-maroon px-4 font-ui text-sm font-semibold text-white transition hover:bg-landing-maroon/90"
                      >
                        Edit Tema
                      </Link>
                      <Link
                        href={`/dashboard/themes/${themeSlug}/preview`}
                        target="_blank"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-landing-border text-landing-ink transition hover:border-landing-gold hover:text-landing-maroon"
                        title="Lihat pratinjau"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

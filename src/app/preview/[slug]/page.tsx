/**
 * /preview/[slug] — Preview halaman undangan Classic Theme
 *
 * URL:  /preview/classic-rehan
 * URL:  /preview/classic-rehan?to=Bapak+Ahmad
 *
 * Guard: hanya aktif di development (NODE_ENV !== 'production').
 * Di production, redirect ke 404 agar URL preview tidak bocor ke publik.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ClassicThemeRenderer } from "@/components/themes/classic";
import { mockClassicTheme, mockInvitationData } from "@/lib/mock";

interface PreviewPageProps {
  params:      Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}

// Hanya generate static untuk slug yang dikenal
export async function generateStaticParams() {
  return [{ slug: "classic-rehan" }];
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title:       `Preview — ${slug} | undang.io`,
    description: "Halaman preview tema undangan. Hanya tersedia di mode development.",
    robots:      { index: false, follow: false },
  };
}

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  // ── Guard: blokir di production ───────────────────────────────
  if (process.env.NODE_ENV === "production") notFound();

  const { slug }  = await params;
  const { to }    = await searchParams;

  // ── Resolve theme — di sini nanti fetch dari Supabase ──────────────
  // Untuk sekarang: selalu pakai mock data
  const themeMap: Record<string, typeof mockClassicTheme> = {
    "classic-rehan": mockClassicTheme,
    // tambah slug baru di sini
  };
  const theme = themeMap[slug];
  if (!theme) notFound();

  return (
    <ClassicThemeRenderer
      theme={theme}
      data={mockInvitationData}
      guestName={to}
      isPreview={true}
    />
  );
}

/* Admin create theme page for /dashboard/themes/create based on docs/design/dashboardthemescreate — Create New Theme Page.png. */

import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CreateThemeWizard } from "./_components/CreateThemeWizard";

export const metadata = {
  title: "Buat Tema Baru — undang.io Dashboard",
};

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "owner"].includes(profile.role)) redirect("/dashboard");
}

export default async function CreateThemePage() {
  await requireAdmin();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-7 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link href="/dashboard/themes" className="inline-flex items-center gap-2 font-ui text-sm font-semibold text-landing-muted hover:text-landing-maroon">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke daftar tema
          </Link>
          <h1 className="mt-4 font-landing-serif text-4xl font-semibold text-landing-ink">Buat Tema Baru</h1>
          <p className="mt-2 max-w-2xl font-ui text-sm leading-6 text-landing-muted">
            Siapkan identitas tema, lalu lanjutkan ke editor aset agar tema siap dipakai pasangan.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-landing-gold/30 bg-landing-gold/10 px-3 py-1 font-ui text-xs font-semibold text-landing-ink">
          <Sparkles className="h-3.5 w-3.5 text-landing-gold" aria-hidden="true" />
          Wizard Tema
        </span>
      </div>

      <CreateThemeWizard />
    </div>
  );
}

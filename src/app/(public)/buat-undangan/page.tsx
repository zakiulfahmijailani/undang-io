"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const QUOTE_PRESETS = [
  { text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.", source: "QS. Ar-Rum: 21" },
  { text: "Maha Suci Allah yang telah menciptakan pasangan-pasangan semuanya.", source: "QS. Yasin: 36" },
  { text: "Love is patient, love is kind. It does not envy, it does not boast.", source: "1 Corinthians 13:4" },
];

type ActiveTheme = {
  id: string;
  name: string;
  description: string | null;
  culturalCategory: string | null;
  thumbnailUrl: string | null;
  slug: string;
};

/** 25 menit dalam milliseconds */
const PREVIEW_DURATION_MS = 25 * 60 * 1000;

function generateSlug(groomNick: string, brideNick: string) {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const year = new Date().getFullYear();
  return `${clean(groomNick)}-${clean(brideNick)}-${year}`;
}

function BuatUndanganContent({ themes }: { themes: ActiveTheme[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const [form, setForm] = useState({
    groomFullName: "", groomNickname: "", groomFather: "", groomMother: "",
    brideFullName: "", brideNickname: "", brideFather: "", brideMother: "",
    akadDate: "", akadTime: "", akadVenue: "", akadAddress: "",
    receptionDate: "", receptionTime: "", receptionVenue: "", receptionAddress: "",
    quote: QUOTE_PRESETS[0].text, quoteSource: QUOTE_PRESETS[0].source,
  });

  useEffect(() => {
    const themeFromUrl = searchParams.get("theme");
    if (themeFromUrl) {
      const match = themes.find((t) => t.id === themeFromUrl || t.slug === themeFromUrl);
      if (match) {
        setSelectedThemeId(match.id);
        setStep(2);
      }
    }

    try {
      const raw = sessionStorage.getItem("undang_draft");
      if (raw) {
        const draft = JSON.parse(raw);
        setForm((prev) => ({
          ...prev,
          groomFullName: draft.groom_name || draft.groom_full_name || prev.groomFullName,
          groomNickname: draft.groom_name || prev.groomNickname,
          brideFullName: draft.bride_name || draft.bride_full_name || prev.brideFullName,
          brideNickname: draft.bride_name || prev.brideNickname,
        }));
        sessionStorage.removeItem("undang_draft");
      }
    } catch (_) {}
  }, [searchParams, themes]);

  const update = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handlePublish = async () => {
    const slug = generateSlug(form.groomNickname || form.groomFullName, form.brideNickname || form.brideFullName);
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + PREVIEW_DURATION_MS).toISOString();

    try {
      const response = await fetch("/api/guest-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken, slug, themeId: selectedThemeId, expiresAt, invitationData: form }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Gagal mempublikasikan undangan.");
      }

      localStorage.setItem("guest_session", JSON.stringify({ sessionToken, slug, expiresAt }));
      localStorage.setItem("guest_return_slug", slug);

      toast.success("🚀 Undangan berhasil dipublikasikan!", {
        description: "Undangan kamu live selama 25 menit. Daftar untuk simpan selamanya!",
      });

      router.push(`/u/${slug}`);
    } catch (error: any) {
      console.error("Publish Error:", error);
      toast.error("Gagal publikasi", { description: error.message || "Terjadi kesalahan sistem." });
    }
  };

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" fill="currentColor" />
            <span className="font-bold text-foreground">undang<span className="text-accent">.io</span></span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex items-center gap-1 ${s === step ? "font-semibold text-foreground" : ""}`}>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    s < step ? "bg-accent text-accent-foreground" : s === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check className="h-3 w-3" /> : s}
                </span>
                <span className="hidden sm:inline">{s === 1 ? "Tema" : s === 2 ? "Data" : "Publish"}</span>
                {s < 3 && <ChevronRight className="h-3 w-3" />}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {step === 1 && (
          <div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">Pilih Tema Undangan</h1>
            <p className="mb-6 text-muted-foreground">Semua tema Rp 49.000 (hemat 51% dari Rp 99.000)</p>
            {themes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <p className="text-lg font-medium">Belum ada tema tersedia</p>
                <p className="text-sm mt-1">Tema sedang disiapkan, silakan coba beberapa saat lagi.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {themes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={`cursor-pointer overflow-hidden transition-all ${
                      selectedThemeId === theme.id ? "ring-2 ring-accent shadow-lg" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedThemeId(theme.id)}
                  >
                    <div className="aspect-[9/16] max-h-52 overflow-hidden">
                      <img
                        src={theme.thumbnailUrl || "/placeholder.svg"}
                        alt={theme.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{theme.name}</h3>
                        {selectedThemeId === theme.id && (
                          <Badge className="bg-accent text-accent-foreground">Dipilih</Badge>
                        )}
                      </div>
                      {theme.culturalCategory && (
                        <Badge variant="secondary" className="mt-1 capitalize">{theme.culturalCategory}</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="mt-8 flex justify-end">
              <Button size="lg" disabled={!selectedThemeId} onClick={() => setStep(2)}>
                Lanjut Isi Data <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mb-4 cursor-pointer">
              <ChevronLeft className="mr-1 h-4 w-4" /> Kembali ke Pilih Tema
            </Button>

            <Alert className="mb-6 border-accent/40 bg-accent/10">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-sm cursor-pointer">
                <strong>Perhatian:</strong> Data yang kamu isi di sini <strong>tidak akan tersimpan</strong> jika kamu tidak mendaftar. Jika ingin menyimpan undangan dan mengaksesnya kapan saja, silakan{" "}
                <Link href="/register" className="font-semibold text-accent underline">Daftar Gratis</Link>{" "}
                terlebih dahulu.
              </AlertDescription>
            </Alert>

            <h1 className="mb-6 text-2xl font-bold text-foreground">Isi Data Undangan</h1>

            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 font-semibold text-foreground">👤 Mempelai Pria</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Nama Lengkap *</Label><Input value={form.groomFullName} onChange={(e) => update("groomFullName", e.target.value)} placeholder="Budi Santoso, S.T." /></div>
                    <div><Label>Nama Panggilan *</Label><Input value={form.groomNickname} onChange={(e) => update("groomNickname", e.target.value)} placeholder="Budi" /></div>
                    <div><Label>Nama Ayah</Label><Input value={form.groomFather} onChange={(e) => update("groomFather", e.target.value)} placeholder="Bapak H. Ahmad Santoso" /></div>
                    <div><Label>Nama Ibu</Label><Input value={form.groomMother} onChange={(e) => update("groomMother", e.target.value)} placeholder="Ibu Hj. Siti Aminah" /></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 font-semibold text-foreground">👤 Mempelai Wanita</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Nama Lengkap *</Label><Input value={form.brideFullName} onChange={(e) => update("brideFullName", e.target.value)} placeholder="Ayu Pratiwi, S.Pd." /></div>
                    <div><Label>Nama Panggilan *</Label><Input value={form.brideNickname} onChange={(e) => update("brideNickname", e.target.value)} placeholder="Ayu" /></div>
                    <div><Label>Nama Ayah</Label><Input value={form.brideFather} onChange={(e) => update("brideFather", e.target.value)} placeholder="Bapak H. Surya Pratama" /></div>
                    <div><Label>Nama Ibu</Label><Input value={form.brideMother} onChange={(e) => update("brideMother", e.target.value)} placeholder="Ibu Hj. Ratna Dewi" /></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 font-semibold text-foreground">📅 Akad Nikah</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Tanggal</Label><Input type="date" value={form.akadDate} onChange={(e) => update("akadDate", e.target.value)} /></div>
                    <div><Label>Jam</Label><Input type="time" value={form.akadTime} onChange={(e) => update("akadTime", e.target.value)} /></div>
                    <div><Label>Nama Gedung/Tempat</Label><Input value={form.akadVenue} onChange={(e) => update("akadVenue", e.target.value)} placeholder="Masjid Agung Al-Azhar" /></div>
                    <div className="sm:col-span-2"><Label>Alamat</Label><Input value={form.akadAddress} onChange={(e) => update("akadAddress", e.target.value)} placeholder="Jl. Sisingamangaraja..." /></div>
                  </div>

                  <h2 className="mb-4 mt-8 font-semibold text-foreground">🎉 Resepsi</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Tanggal</Label><Input type="date" value={form.receptionDate} onChange={(e) => update("receptionDate", e.target.value)} /></div>
                    <div><Label>Jam</Label><Input type="time" value={form.receptionTime} onChange={(e) => update("receptionTime", e.target.value)} /></div>
                    <div><Label>Nama Gedung/Tempat</Label><Input value={form.receptionVenue} onChange={(e) => update("receptionVenue", e.target.value)} placeholder="Balai Kartini" /></div>
                    <div className="sm:col-span-2"><Label>Alamat</Label><Input value={form.receptionAddress} onChange={(e) => update("receptionAddress", e.target.value)} placeholder="Jl. Gatot Subroto..." /></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 font-semibold text-foreground">✨ Ayat / Quote</h2>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {QUOTE_PRESETS.map((q, i) => (
                      <Badge key={i} variant={form.quote === q.text ? "default" : "secondary"} className="cursor-pointer"
                        onClick={() => { update("quote", q.text); update("quoteSource", q.source); }}>
                        {q.source}
                      </Badge>
                    ))}
                  </div>
                  <Textarea value={form.quote} onChange={(e) => update("quote", e.target.value)} rows={3} />
                  <Input className="mt-2" value={form.quoteSource} onChange={(e) => update("quoteSource", e.target.value)} placeholder="Sumber" />
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)} className="cursor-pointer">
                <ChevronLeft className="mr-1 h-4 w-4" /> Kembali
              </Button>
              <Button size="lg" disabled={!form.groomFullName || !form.brideFullName} onClick={() => setStep(3)} className="cursor-pointer">
                Lanjut ke Publish <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mx-auto max-w-lg text-center">
            <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="mb-4 cursor-pointer">
              <ChevronLeft className="mr-1 h-4 w-4" /> Kembali ke Data
            </Button>
            <Heart className="mx-auto mb-4 h-16 w-16 text-accent" />
            <h1 className="mb-2 text-2xl font-bold text-foreground">Undangan Siap Dipublikasikan!</h1>
            <p className="mb-2 text-muted-foreground">
              Undangan <strong>{form.groomNickname || form.groomFullName}</strong> &{" "}
              <strong>{form.brideNickname || form.brideFullName}</strong>
            </p>
            <p className="mb-8 text-sm text-muted-foreground">
              Tema: <strong>{selectedTheme?.name ?? "-"}</strong>
            </p>
            <Alert className="mb-6 border-accent/40 bg-accent/10 text-left">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-sm">
                Undangan akan <strong>live selama 25 menit</strong>. Jika tidak dibayar, undangan akan <strong>otomatis terhapus</strong> setelah waktu habis. Bayar Rp 49.000 untuk menyimpan selamanya.
              </AlertDescription>
            </Alert>
            <Button size="lg" className="w-full gap-2 text-base cursor-pointer" onClick={handlePublish}>
              🚀 Publikasikan Undangan Sekarang
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="text-accent underline">Daftar gratis</Link>{" "}
              untuk menyimpan undangan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

async function fetchActiveThemes(): Promise<ActiveTheme[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("themes")
      .select("id, name, description, cultural_category, thumbnail_url, slug")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch themes:", error);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? "",
      description: row.description ?? null,
      culturalCategory: row.cultural_category ?? null,
      thumbnailUrl: row.thumbnail_url ?? null,
      slug: row.slug ?? "",
    }));
  } catch (err) {
    console.error("Unexpected error fetching themes:", err);
    return [];
  }
}

export default async function BuatUndangan() {
  const themes = await fetchActiveThemes();

  return (
    <Suspense fallback={null}>
      <BuatUndanganContent themes={themes} />
    </Suspense>
  );
}

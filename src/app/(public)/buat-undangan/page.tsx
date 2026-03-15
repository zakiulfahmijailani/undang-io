"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const QUOTE_PRESETS = [
  { text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.", source: "QS. Ar-Rum: 21" },
  { text: "Maha Suci Allah yang telah menciptakan pasangan-pasangan semuanya.", source: "QS. Yasin: 36" },
  { text: "Love is patient, love is kind. It does not envy, it does not boast.", source: "1 Corinthians 13:4" },
];

const activeThemes = [
  {
    id: "theme-jawa-klasik",
    name: "Jawa Klasik",
    description: "Tema undangan dengan nuansa Jawa klasik, ornamen batik, dan warna emas-cokelat.",
    culturalCategory: "jawa",
    thumbnailUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=338&h=600&fit=crop"
  },
  {
    id: "theme-bali-tropis",
    name: "Bali Tropis",
    description: "Nuansa tropis Bali dengan hijau daun, bunga frangipani, dan suasana pantai.",
    culturalCategory: "bali",
    thumbnailUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=338&h=600&fit=crop"
  },
  {
    id: "theme-modern-minimalis",
    name: "Modern Minimalis",
    description: "Desain bersih dan modern dengan tipografi elegan dan palet netral.",
    culturalCategory: "minimalis",
    thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=338&h=600&fit=crop"
  }
];

function generateSlug(groomNick: string, brideNick: string) {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const year = new Date().getFullYear();
  return `${clean(groomNick)}-${clean(brideNick)}-${year}`;
}

export default function BuatUndangan() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    groomFullName: "", groomNickname: "", groomFather: "", groomMother: "",
    brideFullName: "", brideNickname: "", brideFather: "", brideMother: "",
    akadDate: "", akadTime: "", akadVenue: "", akadAddress: "",
    receptionDate: "", receptionTime: "", receptionVenue: "", receptionAddress: "",
    quote: QUOTE_PRESETS[0].text, quoteSource: QUOTE_PRESETS[0].source,
  });

  const update = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handlePublish = async () => {
    const slug = generateSlug(form.groomNickname || form.groomFullName, form.brideNickname || form.brideFullName);

    // Metadata for the guest session (25-minute trial)
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    try {
      // ✅ FIX: Using fetch() to call our secure API route instead of direct Supabase call
      const response = await fetch("/api/invitations/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken,
          slug,
          themeId: selectedThemeId,
          expiresAt,
          invitationData: form,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Gagal mempublikasikan undangan.");
      }

      // Save session info locally for the conversion flow after login
      localStorage.setItem(
        "guest_session",
        JSON.stringify({
          sessionToken,
          slug,
          themeId: selectedThemeId,
          expiresAt,
          invitationData: form,
        })
      );
      localStorage.setItem("guest_return_slug", slug); // ← TAMBAH BARIS INI SAJA
      toast.success("🚀 Undangan berhasil dipublikasikan!", {
        description: "Undangan kamu live selama 25 menit. Daftar untuk simpan selamanya!",
      });

      router.push(`/u/${slug}`);
    } catch (error: any) {
      console.error("Publish Error:", error);
      toast.error("Gagal publikasi", {
        description: error.message || "Terjadi kesalahan sistem.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" fill="currentColor" />
            <span className="font-bold text-foreground">
              undang<span className="text-accent">.io</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex items-center gap-1 ${s === step ? "font-semibold text-foreground" : ""}`}>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${s < step
                    ? "bg-accent text-accent-foreground"
                    : s === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
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
        {/* Step 1: Choose Theme */}
        {step === 1 && (
          <div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">Pilih Tema Undangan</h1>
            <p className="mb-6 text-muted-foreground">Semua tema Rp 49.000 (hemat 51% dari Rp 99.000)</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeThemes.map((theme) => (
                <Card
                  key={theme.id}
                  className={`cursor-pointer overflow-hidden transition-all ${selectedThemeId === theme.id ? "ring-2 ring-accent shadow-lg" : "hover:shadow-md"
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
                    <Badge variant="secondary" className="mt-1 capitalize">
                      {theme.culturalCategory}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button size="lg" disabled={!selectedThemeId} onClick={() => setStep(2)}>
                Lanjut Isi Data <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Fill Form */}
        {step === 2 && (
          <div>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mb-4 cursor-pointer">
              <ChevronLeft className="mr-1 h-4 w-4" /> Kembali ke Pilih Tema
            </Button>

            <Alert className="mb-6 border-accent/40 bg-accent/10">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-sm cursor-pointer">
                <strong>Perhatian:</strong> Data yang kamu isi di sini <strong>tidak akan tersimpan</strong> jika kamu
                tidak mendaftar. Jika ingin menyimpan undangan dan mengaksesnya kapan saja, silakan{" "}
                <Link href="/register" className="font-semibold text-accent underline">
                  Daftar Gratis
                </Link>{" "}
                terlebih dahulu.
              </AlertDescription>
            </Alert>

            <h1 className="mb-6 text-2xl font-bold text-foreground">Isi Data Undangan</h1>

            <div className="space-y-8">
              {/* Mempelai Pria */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 font-semibold text-foreground">👤 Mempelai Pria</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Nama Lengkap *</Label>
                      <Input
                        value={form.groomFullName}
                        onChange={(e) => update("groomFullName", e.target.value)}
                        placeholder="Budi Santoso, S.T."
                      />
                    </div>
                    <div>
                      <Label>Nama Panggilan *</Label>
                      <Input
                        value={form.groomNickname}
                        onChange={(e) => update("groomNickname", e.target.value)}
                        placeholder="Budi"
                      />
                    </div>
                    <div>
                      <Label>Nama Ayah</Label>
                      <Input
                        value={form.groomFather}
                        onChange={(e) => update("groomFather", e.target.value)}
                        placeholder="Bapak H. Ahmad Santoso"
                      />
                    </div>
                    <div>
                      <Label>Nama Ibu</Label>
                      <Input
                        value={form.groomMother}
                        onChange={(e) => update("groomMother", e.target.value)}
                        placeholder="Ibu Hj. Siti Aminah"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mempelai Wanita */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 font-semibold text-foreground">👤 Mempelai Wanita</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Nama Lengkap *</Label>
                      <Input
                        value={form.brideFullName}
                        onChange={(e) => update("brideFullName", e.target.value)}
                        placeholder="Ayu Pratiwi, S.Pd."
                      />
                    </div>
                    <div>
                      <Label>Nama Panggilan *</Label>
                      <Input
                        value={form.brideNickname}
                        onChange={(e) => update("brideNickname", e.target.value)}
                        placeholder="Ayu"
                      />
                    </div>
                    <div>
                      <Label>Nama Ayah</Label>
                      <Input
                        value={form.brideFather}
                        onChange={(e) => update("brideFather", e.target.value)}
                        placeholder="Bapak H. Surya Pratama"
                      />
                    </div>
                    <div>
                      <Label>Nama Ibu</Label>
                      <Input
                        value={form.brideMother}
                        onChange={(e) => update("brideMother", e.target.value)}
                        placeholder="Ibu Hj. Ratna Dewi"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Acara */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 font-semibold text-foreground">📅 Akad Nikah</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Tanggal</Label>
                      <Input
                        type="date"
                        value={form.akadDate}
                        onChange={(e) => update("akadDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Jam</Label>
                      <Input
                        type="time"
                        value={form.akadTime}
                        onChange={(e) => update("akadTime", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Nama Gedung/Tempat</Label>
                      <Input
                        value={form.akadVenue}
                        onChange={(e) => update("akadVenue", e.target.value)}
                        placeholder="Masjid Agung Al-Azhar"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Alamat</Label>
                      <Input
                        value={form.akadAddress}
                        onChange={(e) => update("akadAddress", e.target.value)}
                        placeholder="Jl. Sisingamangaraja..."
                      />
                    </div>
                  </div>

                  <h2 className="mb-4 mt-8 font-semibold text-foreground">🎉 Resepsi</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Tanggal</Label>
                      <Input
                        type="date"
                        value={form.receptionDate}
                        onChange={(e) => update("receptionDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Jam</Label>
                      <Input
                        type="time"
                        value={form.receptionTime}
                        onChange={(e) => update("receptionTime", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Nama Gedung/Tempat</Label>
                      <Input
                        value={form.receptionVenue}
                        onChange={(e) => update("receptionVenue", e.target.value)}
                        placeholder="Balai Kartini"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Alamat</Label>
                      <Input
                        value={form.receptionAddress}
                        onChange={(e) => update("receptionAddress", e.target.value)}
                        placeholder="Jl. Gatot Subroto..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quote */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 font-semibold text-foreground">✨ Ayat / Quote</h2>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {QUOTE_PRESETS.map((q, i) => (
                      <Badge
                        key={i}
                        variant={form.quote === q.text ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => {
                          update("quote", q.text);
                          update("quoteSource", q.source);
                        }}
                      >
                        {q.source}
                      </Badge>
                    ))}
                  </div>
                  <Textarea
                    value={form.quote}
                    onChange={(e) => update("quote", e.target.value)}
                    rows={3}
                  />
                  <Input
                    className="mt-2"
                    value={form.quoteSource}
                    onChange={(e) => update("quoteSource", e.target.value)}
                    placeholder="Sumber"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)} className="cursor-pointer">
                <ChevronLeft className="mr-1 h-4 w-4" /> Kembali
              </Button>
              <Button
                size="lg"
                disabled={!form.groomFullName || !form.brideFullName}
                onClick={() => setStep(3)}
                className="cursor-pointer"
              >
                Lanjut ke Publish <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Publish */}
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
              Tema: <strong>{activeThemes.find((t) => t.id === selectedThemeId)?.name}</strong>
            </p>

            <Alert className="mb-6 border-accent/40 bg-accent/10 text-left">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-sm">
                Undangan akan <strong>live selama 15 menit</strong>. Untuk menyimpan selamanya, daftar akun dan bayar Rp
                49.000.
              </AlertDescription>
            </Alert>

            <Button size="lg" className="w-full gap-2 text-base cursor-pointer" onClick={handlePublish}>
              🚀 Publikasikan Undangan Sekarang
            </Button>

            <p className="mt-4 text-xs text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="text-accent underline">
                Daftar gratis
              </Link>{" "}
              untuk menyimpan undangan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

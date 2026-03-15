"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const temaId = searchParams.get("tema") || "th-01";

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        slug: "",
        customDomain: "",
        groom_full_name: "",
        groom_nickname: "",
        groom_father: "",
        groom_mother: "",
        bride_full_name: "",
        bride_nickname: "",
        bride_father: "",
        bride_mother: "",
    });

    const updateForm = (key: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            theme_id: temaId,
            slug: formData.slug,
            groom_name: formData.groom_nickname,
            bride_name: formData.bride_nickname,
            details: {
                groom_full_name: formData.groom_full_name,
                groom_nickname: formData.groom_nickname,
                groom_father: formData.groom_father,
                groom_mother: formData.groom_mother,
                bride_full_name: formData.bride_full_name,
                bride_nickname: formData.bride_nickname,
                bride_father: formData.bride_father,
                bride_mother: formData.bride_mother,
            }
        };

        try {
            const response = await fetch('/api/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error?.message || 'Gagal menyimpan undangan.');
            }

            toast.success("Undangan berhasil disimpan!", {
                description: "Anda akan diarahkan ke dasbor.",
            });

            router.push("/dashboard");

        } catch (error: any) {
            console.error("Save Invitation Error:", error);
            toast.error("Gagal menyimpan", {
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#14213D]">Buat Undangan Baru</h1>
                        <p className="text-sm text-muted-foreground mt-1">Tema Terpilih: {temaId}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-4">Informasi Dasar</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Judul Undangan (Slug)</label>
                            <input
                                name="slug"
                                value={formData.slug}
                                onChange={e => updateForm('slug', e.target.value)}
                                required
                                type="text"
                                placeholder="contoh: romeo-juliet"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Ini akan menjadi link undangan Anda: umuman.com/u/{formData.slug || '...'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Domain Kustom (Opsional)</label>
                            <input
                                name="customDomain"
                                value={formData.customDomain}
                                onChange={e => updateForm('customDomain', e.target.value)}
                                type="text"
                                placeholder="contoh: romeojuliet.com"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-4">Data Mempelai</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm text-[#14213D] border-b pb-2">Mempelai Pria</h4>
                            <div>
                                <label className="text-sm font-medium">Nama Lengkap</label>
                                <input name="groom_full_name" value={formData.groom_full_name} onChange={e => updateForm('groom_full_name', e.target.value)} required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Panggilan</label>
                                <input name="groom_nickname" value={formData.groom_nickname} onChange={e => updateForm('groom_nickname', e.target.value)} required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Ayah</label>
                                <input name="groom_father" value={formData.groom_father} onChange={e => updateForm('groom_father', e.target.value)} required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Ibu</label>
                                <input name="groom_mother" value={formData.groom_mother} onChange={e => updateForm('groom_mother', e.target.value)} required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm text-[#14213D] border-b pb-2">Mempelai Wanita</h4>
                            <div>
                                <label className="text-sm font-medium">Nama Lengkap</label>
                                <input name="bride_full_name" value={formData.bride_full_name} onChange={e => updateForm('bride_full_name', e.target.value)} required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Panggilan</label>
                                <input name="bride_nickname" value={formData.bride_nickname} onChange={e => updateForm('bride_nickname', e.target.value)} required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Ayah</label>
                                <input name="bride_father" value={formData.bride_father} onChange={e => updateForm('bride_father', e.target.value)} required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Ibu</label>
                                <input name="bride_mother" value={formData.bride_mother} onChange={e => updateForm('bride_mother', e.target.value)} required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={loading} className="bg-[#14213D] hover:bg-[#1a2b50] text-white px-8 h-12">
                        {loading ? 'Menyimpan...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" /> Simpan & Lanjutkan
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

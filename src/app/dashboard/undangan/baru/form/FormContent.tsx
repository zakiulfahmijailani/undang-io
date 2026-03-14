"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const temaId = searchParams.get("tema") || "th-01";

    const [loading, setLoading] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            router.push("/dashboard");
        }, 800);
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
                            <input required type="text" placeholder="contoh: romeo-juliet" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            <p className="text-xs text-muted-foreground mt-1">Ini akan menjadi link undangan Anda: umuman.com/u/romeo-juliet</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Domain Kustom (Opsional)</label>
                            <input type="text" placeholder="contoh: romeojuliet.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
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
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Panggilan</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Ayah</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Ibu</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm text-[#14213D] border-b pb-2">Mempelai Wanita</h4>
                            <div>
                                <label className="text-sm font-medium">Nama Lengkap</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Panggilan</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Ayah</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Nama Ibu</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
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

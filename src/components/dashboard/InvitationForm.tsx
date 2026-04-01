"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface InvitationFormProps {
    invitationId: string;
    initialData: {
        groomNickname: string;
        brideNickname: string;
        groomFullName: string;
        brideFullName: string;
        parentGroom: string;
        parentBride: string;
    };
    mode: "create" | "edit";
}

export default function InvitationForm({ invitationId, initialData, mode }: InvitationFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [groomNickname, setGroomNickname] = useState(initialData.groomNickname);
    const [brideNickname, setBrideNickname] = useState(initialData.brideNickname);
    const [groomFullName, setGroomFullName] = useState(initialData.groomFullName);
    const [brideFullName, setBrideFullName] = useState(initialData.brideFullName);
    const [parentGroom, setParentGroom] = useState(initialData.parentGroom);
    const [parentBride, setParentBride] = useState(initialData.parentBride);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!groomNickname.trim() || !brideNickname.trim()) {
            toast.error("Nama panggilan mempelai wajib diisi.");
            return;
        }

        setIsLoading(true);

        try {
            const supabase = createBrowserSupabaseClient();

            const { error } = await supabase
                .from("invitations")
                .update({
                    groom_nickname: groomNickname.trim(),
                    bride_nickname: brideNickname.trim(),
                    groom_full_name: groomFullName.trim() || null,
                    bride_full_name: brideFullName.trim() || null,
                    parent_groom: parentGroom.trim() || null,
                    parent_bride: parentBride.trim() || null,
                })
                .eq("id", invitationId);

            if (error) throw error;

            toast.success("Data undangan berhasil disimpan! ✨");
            router.refresh();
        } catch (err: any) {
            console.error("[InvitationForm] save error:", err);
            toast.error(err.message || "Gagal menyimpan data undangan.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mempelai Pria */}
                <div className="space-y-4 p-5 rounded-xl border border-border bg-card">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                        Mempelai Pria
                    </h3>
                    <Input
                        id="groom_nickname"
                        label="Nama Panggilan"
                        placeholder="Cth: Budi"
                        value={groomNickname}
                        onChange={(e) => setGroomNickname(e.target.value)}
                        disabled={isLoading}
                        maxLength={100}
                    />
                    <Input
                        id="groom_full_name"
                        label="Nama Lengkap (opsional)"
                        placeholder="Cth: Muhammad Budi Santoso"
                        value={groomFullName}
                        onChange={(e) => setGroomFullName(e.target.value)}
                        disabled={isLoading}
                        maxLength={200}
                    />
                    <Input
                        id="parent_groom"
                        label="Nama Orang Tua (opsional)"
                        placeholder="Cth: Bpk. Ahmad & Ibu Sari"
                        value={parentGroom}
                        onChange={(e) => setParentGroom(e.target.value)}
                        disabled={isLoading}
                        maxLength={200}
                    />
                </div>

                {/* Mempelai Wanita */}
                <div className="space-y-4 p-5 rounded-xl border border-border bg-card">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                        Mempelai Wanita
                    </h3>
                    <Input
                        id="bride_nickname"
                        label="Nama Panggilan"
                        placeholder="Cth: Ayu"
                        value={brideNickname}
                        onChange={(e) => setBrideNickname(e.target.value)}
                        disabled={isLoading}
                        maxLength={100}
                    />
                    <Input
                        id="bride_full_name"
                        label="Nama Lengkap (opsional)"
                        placeholder="Cth: Ayu Lestari Putri"
                        value={brideFullName}
                        onChange={(e) => setBrideFullName(e.target.value)}
                        disabled={isLoading}
                        maxLength={200}
                    />
                    <Input
                        id="parent_bride"
                        label="Nama Orang Tua (opsional)"
                        placeholder="Cth: Bpk. Surya & Ibu Dewi"
                        value={parentBride}
                        onChange={(e) => setParentBride(e.target.value)}
                        disabled={isLoading}
                        maxLength={200}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="gap-2 px-6 h-11 shadow-md"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" /> Simpan Data Mempelai
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

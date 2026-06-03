"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface DeleteInvitationButtonProps {
    invitationId: string;
    invitationTitle: string;
}

export default function DeleteInvitationButton({ invitationId, invitationTitle }: DeleteInvitationButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        try {
            const supabase = createBrowserSupabaseClient();
            const { error } = await supabase
                .from('invitations')
                .update({ soft_delete_at: new Date().toISOString() })
                .eq('id', invitationId);

            if (error) {
                toast.error("Gagal menghapus undangan", { description: error.message });
            } else {
                toast.success("Undangan berhasil dihapus", {
                    description: `"${invitationTitle}" telah dihapus.`,
                });
                setOpen(false);
                router.refresh();
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Silakan coba lagi.";
            toast.error("Terjadi kesalahan", { description: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 transition hover:bg-red-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setOpen(true)}
                disabled={loading}
            >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Hapus Undangan?"
                description={`Undangan "${invitationTitle}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
            >
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-landing-border bg-white px-4 font-ui text-sm font-semibold text-landing-ink transition hover:border-landing-gold disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 font-ui text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </Modal>
        </>
    );
}

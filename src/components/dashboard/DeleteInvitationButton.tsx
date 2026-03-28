"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        } catch (e: any) {
            toast.error("Terjadi kesalahan", { description: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="secondary"
                className="shrink-0 h-9 w-9 p-0 text-destructive border border-destructive/20 hover:bg-destructive/10 cursor-pointer"
                onClick={() => setOpen(true)}
                disabled={loading}
            >
                <Trash2 className="w-4 h-4" />
            </Button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Hapus Undangan?"
                description={`Undangan "${invitationTitle}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
            >
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="secondary"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                    >
                        {loading ? "Menghapus..." : "Ya, Hapus"}
                    </Button>
                </div>
            </Modal>
        </>
    );
}

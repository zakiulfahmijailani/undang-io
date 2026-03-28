"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface DeleteInvitationButtonProps {
    invitationId: string;
    invitationTitle: string;
}

export default function DeleteInvitationButton({ invitationId, invitationTitle }: DeleteInvitationButtonProps) {
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
                router.refresh();
            }
        } catch (e: any) {
            toast.error("Terjadi kesalahan", { description: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="shrink-0 h-9 w-9 p-0 text-destructive border border-destructive/20 hover:bg-destructive/10 cursor-pointer"
                    disabled={loading}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Undangan?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Undangan <span className="font-semibold text-foreground">&ldquo;{invitationTitle}&rdquo;</span> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                    >
                        {loading ? "Menghapus..." : "Ya, Hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

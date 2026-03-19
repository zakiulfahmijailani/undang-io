"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function NewInvitationDialog({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [groomName, setGroomName] = useState("");
    const [brideName, setBrideName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!groomName.trim() || !brideName.trim()) {
            setError("Both names are required for your masterpiece.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groom_name: groomName, bride_name: brideName }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error?.message || "An error occurred while manifesting your invitation.");
            }

            setOpen(false);
            router.push(`/dashboard/undangan/${result.data.id}/edit`);
        } catch (err: any) {
            setError(err.message || "Failed to reach the concierge.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {children ? children : (
                    <button className="bg-primary text-on-primary rounded-full py-4 px-8 flex items-center justify-center gap-3 font-['Inter'] text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-primary/20 cursor-pointer">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        Manifest New Invitation
                    </button>
                )}
            </div>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Begin Your Narrative"
                description="Enter the names of the couple. You can refine these editorial details later."
            >
                <form onSubmit={handleSubmit} className="space-y-8 pt-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                id="groom_name"
                                label="Groom Nickname"
                                placeholder="e.g., Alexander"
                                value={groomName}
                                onChange={(e) => setGroomName(e.target.value)}
                                disabled={isLoading}
                                maxLength={100}
                                required
                                className="bg-surface-container-low border-outline-variant/10 rounded-2xl"
                            />
                            <Input
                                id="bride_name"
                                label="Bride Nickname"
                                placeholder="e.g., Isabella"
                                value={brideName}
                                onChange={(e) => setBrideName(e.target.value)}
                                disabled={isLoading}
                                maxLength={100}
                                required
                                className="bg-surface-container-low border-outline-variant/10 rounded-2xl"
                            />
                        </div>
                        {error && (
                            <p className="text-xs text-error font-bold uppercase tracking-widest animate-pulse">{error}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/10">
                        <button 
                            type="button" 
                            onClick={() => setOpen(false)} 
                            disabled={isLoading}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin text-tertiary" />
                                    Manifesting...
                                </>
                            ) : (
                                "Begin Creation"
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

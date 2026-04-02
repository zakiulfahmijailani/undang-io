"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { ThemeAsset, AssetKind } from "@/types/theme";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import {
    Loader2, Upload, Trash2, ImageIcon, Plus, FolderOpen,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

// ─── Constants ──────────────────────────────────────────────────────────────────

const ASSET_KINDS: { value: AssetKind; label: string }[] = [
    { value: "background", label: "Background" },
    { value: "ornament_top", label: "Ornamen Atas" },
    { value: "ornament_bottom_left", label: "Ornamen Bawah Kiri" },
    { value: "ornament_bottom_right", label: "Ornamen Bawah Kanan" },
    { value: "ornament_corner", label: "Ornamen Pojok" },
    { value: "frame", label: "Frame" },
    { value: "pattern", label: "Pattern" },
    { value: "divider", label: "Divider" },
    { value: "music", label: "Musik" },
];

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function ThemeAssetsPage() {
    const [assets, setAssets] = useState<ThemeAsset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Upload form state
    const [label, setLabel] = useState("");
    const [themeKey, setThemeKey] = useState("");
    const [kind, setKind] = useState<AssetKind>("background");
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = useState<ThemeAsset | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const supabase = createBrowserSupabaseClient();

    // ── Fetch user & assets ──────────────────────────────────────────────────

    const fetchAssets = useCallback(async () => {
        if (!supabase) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserId(user.id);

        const { data, error } = await supabase
            .from("theme_assets")
            .select("id, theme_key, kind, label, image_url, is_global, created_by, created_at")
            .eq("created_by", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[assets] fetch error:", error);
            toast.error("Gagal memuat aset tema.");
        }

        setAssets((data as ThemeAsset[]) || []);
        setIsLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    // ── Upload handler ───────────────────────────────────────────────────────

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!supabase || !userId) {
            toast.error("Kamu belum login.");
            return;
        }
        if (!label.trim()) {
            toast.error("Label wajib diisi.");
            return;
        }
        if (!themeKey.trim()) {
            toast.error("Theme key wajib diisi.");
            return;
        }
        if (!file) {
            toast.error("Pilih file untuk diupload.");
            return;
        }

        setIsUploading(true);

        try {
            // 1. Upload to Supabase Storage
            const safeName = file.name.replace(/\s+/g, "_").toLowerCase();
            const storagePath = `${userId}/${themeKey.trim()}/${kind}/${safeName}`;

            const { error: uploadError } = await supabase.storage
                .from("theme-assets")
                .upload(storagePath, file, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            // 2. Get public URL
            const { data: urlData } = supabase.storage
                .from("theme-assets")
                .getPublicUrl(storagePath);

            const publicUrl = urlData.publicUrl;

            // 3. Insert row into theme_assets
            const { error: insertError } = await supabase
                .from("theme_assets")
                .insert({
                    theme_key: themeKey.trim(),
                    kind,
                    label: label.trim(),
                    image_url: publicUrl,
                    asset_url: publicUrl,
                    asset_type: file.type.startsWith("audio/") ? "audio" : "image",
                    slot: kind,
                    is_global: false,
                    created_by: userId,
                });

            if (insertError) throw insertError;

            toast.success("Aset berhasil diupload! 🎉");

            // Reset form
            setLabel("");
            setThemeKey("");
            setKind("background");
            setFile(null);

            // Refresh list
            await fetchAssets();
        } catch (err: any) {
            console.error("[assets] upload error:", err);
            toast.error(err.message || "Gagal mengupload aset.");
        } finally {
            setIsUploading(false);
        }
    };

    // ── Delete handler ───────────────────────────────────────────────────────

    const handleDelete = async () => {
        if (!supabase || !deleteTarget) return;

        setIsDeleting(true);

        try {
            const { error } = await supabase
                .from("theme_assets")
                .delete()
                .eq("id", deleteTarget.id);

            if (error) throw error;

            setAssets((prev) => prev.filter((a) => a.id !== deleteTarget.id));
            toast.success("Aset berhasil dihapus.");
        } catch (err: any) {
            console.error("[assets] delete error:", err);
            toast.error(err.message || "Gagal menghapus aset.");
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    };

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Aset Tema</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                    Kelola gambar background, ornamen, dan musik untuk tema undanganmu.
                </p>
            </div>

            {/* Upload Form */}
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" /> Upload Aset Baru
                    </h2>
                    <form onSubmit={handleUpload} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Input
                                id="asset_label"
                                label="Label"
                                placeholder="Cth: Background Jawa Gold"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                disabled={isUploading}
                                required
                            />
                            <Input
                                id="asset_theme_key"
                                label="Theme Key"
                                placeholder="Cth: classic_jawa"
                                value={themeKey}
                                onChange={(e) => setThemeKey(e.target.value)}
                                disabled={isUploading}
                                required
                            />
                            <Select
                                id="asset_kind"
                                label="Jenis Aset"
                                value={kind}
                                onChange={(e) => setKind(e.target.value as AssetKind)}
                                disabled={isUploading}
                                required
                            >
                                {ASSET_KINDS.map((k) => (
                                    <option key={k.value} value={k.value}>
                                        {k.label}
                                    </option>
                                ))}
                            </Select>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="asset_file" className="text-label-sm sm:text-label-lg mb-1 text-[var(--color-neutral-700)]">
                                    File <span className="text-[var(--color-error-base)] ml-1">*</span>
                                </label>
                                <input
                                    id="asset_file"
                                    type="file"
                                    accept="image/*,audio/*"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    disabled={isUploading}
                                    className="block w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isUploading}
                                className="gap-2 px-6 h-11 shadow-md"
                            >
                                {isUploading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Mengupload...</>
                                ) : (
                                    <><Upload className="w-4 h-4" /> Upload Aset</>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Asset Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-border bg-card animate-pulse">
                            <div className="aspect-[4/3] bg-secondary rounded-t-2xl" />
                            <div className="p-4 space-y-2">
                                <div className="h-4 bg-secondary rounded w-3/4" />
                                <div className="h-3 bg-secondary rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-card rounded-3xl border border-border shadow-sm text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                        <FolderOpen className="w-10 h-10 text-primary/60" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Belum Ada Aset</h2>
                    <p className="text-muted-foreground max-w-md">
                        Upload gambar background, ornamen, atau musik untuk memulai kustomisasi tema undanganmu.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {assets.map((asset) => (
                        <Card key={asset.id} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                            {/* Thumbnail */}
                            <div className="aspect-[4/3] relative bg-secondary overflow-hidden">
                                {asset.kind === "music" ? (
                                    <div className="flex items-center justify-center h-full bg-secondary">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                                            </svg>
                                            <span className="text-xs font-medium">Audio</span>
                                        </div>
                                    </div>
                                ) : asset.image_url ? (
                                    <Image
                                        src={asset.image_url}
                                        alt={asset.label}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <CardContent className="p-4 space-y-2">
                                <h3 className="font-semibold text-foreground text-sm truncate" title={asset.label}>
                                    {asset.label}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                                        {ASSET_KINDS.find((k) => k.value === asset.kind)?.label || asset.kind}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                        {asset.theme_key}
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <button
                                        onClick={() => setDeleteTarget(asset)}
                                        className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 font-medium transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Hapus Aset?"
                description={`Aset "${deleteTarget?.label}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
            >
                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="gap-2"
                    >
                        {isDeleting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Menghapus...</>
                        ) : (
                            <><Trash2 className="w-4 h-4" /> Hapus Permanen</>
                        )}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, Upload, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { SectionFormProps } from "./types";

export function GallerySection({ data, onChange }: SectionFormProps) {
 const [isUploading, setIsUploading] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const photos = data.gallery_photos || [];

 async function handleUpload(file: File | null) {
  if (!file) return;
  if (!data.id) { toast.error("Simpan undangan terlebih dahulu."); return; }
  setIsUploading(true);

  const body = new FormData();
  body.set("file", file);
  body.set("invitation_id", data.id);
  body.set("type", "gallery");

  try {
   const response = await fetch("/api/upload", { method: "POST", body });
   const result = await response.json();

   if (!response.ok || !result.data) {
    toast.error(result.error?.message || "Gagal mengunggah foto.");
    return;
   }

   onChange({ gallery_photos: [...photos, result.data.url] });
   toast.success("Foto berhasil ditambahkan.");
  } catch (error) {
   console.error("[editor] upload failed:", error);
   toast.error("Terjadi kesalahan saat mengunggah foto.");
  } finally {
   setIsUploading(false);
   if (fileInputRef.current) fileInputRef.current.value = "";
  }
 }

 const removePhoto = (index: number) => {
  const next = [...photos];
  next.splice(index, 1);
  onChange({ gallery_photos: next });
 };

 return (
  <div className="space-y-6">
   <div className="flex items-center justify-between rounded-lg border p-4">
    <div className="space-y-0.5">
     <Label className="text-base">Tampilkan Galeri Prewedding</Label>
     <p className="text-sm text-muted-foreground">Galeri akan muncul di undangan publik</p>
    </div>
    <Switch checked={data.show_prewed_gallery !== false} onCheckedChange={(c) => onChange({ show_prewed_gallery: c })} />
   </div>

   <div className="grid grid-cols-3 gap-4">
    {photos.map((url, i) => (
     <div key={i} className="relative aspect-square rounded-lg border overflow-hidden">
      <img src={url} alt="" className="w-full h-full object-cover" />
      <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/80">
       <X className="w-4 h-4" />
      </button>
     </div>
    ))}
   </div>

   <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => void handleUpload(e.target.files?.[0] ?? null)} className="hidden" />
   <Button type="button" variant="secondary" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
    Tambah Foto
   </Button>
  </div>
 );
}

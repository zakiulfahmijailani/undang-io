"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { SectionFormProps } from "./types";

export function FotoCoverSection({ data, onChange }: SectionFormProps) {
 const [isUploading, setIsUploading] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 async function handleUpload(file: File | null) {
  if (!file) return;
  if (!data.id) { toast.error("Simpan undangan terlebih dahulu."); return; }
  setIsUploading(true);

  const body = new FormData();
  body.set("file", file);
  body.set("invitation_id", data.id);
  body.set("type", "cover");

  try {
   const response = await fetch("/api/upload", { method: "POST", body });
   const result = await response.json();

   if (!response.ok || !result.data) {
    toast.error(result.error?.message || "Gagal mengunggah foto.");
    return;
   }

   onChange({ couple_photo_url: result.data.url });
   toast.success("Foto cover berhasil diunggah.");
  } catch (error) {
   console.error("[editor] upload failed:", error);
   toast.error("Terjadi kesalahan saat mengunggah foto.");
  } finally {
   setIsUploading(false);
   if (fileInputRef.current) fileInputRef.current.value = "";
  }
 }

 return (
  <div className="space-y-6">
   <div className="space-y-4 rounded-lg border p-4">
    <Label>Foto Cover Utama</Label>
    <div className="flex flex-col gap-4">
     <div className="relative flex h-32 w-32 shrink-0 overflow-hidden rounded-md border bg-muted">
      {data.couple_photo_url ? (
       <img src={data.couple_photo_url} alt="Cover" className="h-full w-full object-cover" />
      ) : (
       <ImageIcon className="m-auto h-8 w-8 text-muted-foreground" />
      )}
     </div>
     <div className="flex flex-col items-start gap-2">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => void handleUpload(e.target.files?.[0] ?? null)} className="hidden" />
      <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
       {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
       Unggah Foto
      </Button>
      <p className="text-xs text-muted-foreground">Digunakan untuk hero, cover, dan link preview.</p>
     </div>
    </div>
   </div>
   
   <div className="space-y-4 rounded-lg border p-4">
    <Label>Foto Background (Opsional)</Label>
    <Input value={data.background_photo_url || ""} onChange={(e) => onChange({ background_photo_url: e.target.value })} placeholder="URL gambar background" />
   </div>
  </div>
 );
}

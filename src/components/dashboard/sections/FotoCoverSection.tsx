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
   <div className="space-y-4 rounded-xl border border-landing-border bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-1.5">
     <Label className="font-ui text-base font-semibold text-landing-ink">Foto Pasangan (Cover)</Label>
     <p className="text-xs text-landing-muted">Ditampilkan pada halaman depan, layar hero, dan gambar link preview.</p>
    </div>
    
    <div className="flex flex-col items-center sm:flex-row gap-5 sm:gap-6 pt-2">
     <div className="group relative flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-landing-gold/40 bg-[#FAF7F2] transition-colors hover:border-landing-gold hover:bg-[#FDFBF7]">
      {data.couple_photo_url ? (
       <img src={data.couple_photo_url} alt="Cover Pasangan" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
       <div className="flex flex-col items-center gap-2 text-landing-gold/50">
        <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
        <span className="font-ui text-[10px] font-medium uppercase tracking-wider">Pilih Foto</span>
       </div>
      )}
     </div>
     
     <div className="flex flex-1 flex-col items-center sm:items-start gap-4 text-center sm:text-left">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => void handleUpload(e.target.files?.[0] ?? null)} className="hidden" />
      <div className="flex flex-col items-center sm:items-start gap-2">
        <Button 
          type="button" 
          variant="secondary"
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm transition-all"
        >
         {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
         Foto Utama
        </Button>
        <p className="text-xs text-landing-muted max-w-[220px] leading-relaxed">
         Rekomendasi ukuran: 1080x1080px (Rasio 1:1) dengan format JPG/PNG, maks 5MB.
        </p>
      </div>
     </div>
    </div>
   </div>
   
   <div className="space-y-4 rounded-xl border border-landing-border bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-1.5">
     <Label className="font-ui text-base font-semibold text-landing-ink">Foto Background Tambahan (Opsional)</Label>
     <p className="text-xs text-landing-muted">Jika diisi, akan menggantikan warna latar pada beberapa tema (seperti Obsidian Luxe).</p>
    </div>
    <div className="pt-2">
     <Input className="h-11 rounded-lg border-landing-border bg-[#FAFAFA] font-ui" value={data.background_photo_url || ""} onChange={(e) => onChange({ background_photo_url: e.target.value })} placeholder="Masukkan URL gambar background..." />
    </div>
   </div>
  </div>
 );
}

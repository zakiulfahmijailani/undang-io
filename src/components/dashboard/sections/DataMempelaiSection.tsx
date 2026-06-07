"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { SectionFormProps } from "./types";

export function DataMempelaiSection({ data, onChange }: SectionFormProps) {
 const [isUploading, setIsUploading] = useState<"groom" | "bride" | null>(null);
 const groomInputRef = useRef<HTMLInputElement>(null);
 const brideInputRef = useRef<HTMLInputElement>(null);

 async function handleUpload(file: File | null, type: "groom" | "bride") {
  if (!file) return;
  if (!data.id) { toast.error("Simpan undangan terlebih dahulu untuk mengunggah foto."); return; }
  setIsUploading(type);

  const body = new FormData();
  body.set("file", file);
  body.set("invitation_id", data.id);
  body.set("type", type);

  try {
   const response = await fetch("/api/upload", { method: "POST", body });
   const result = await response.json();

   if (!response.ok || !result.data) {
    toast.error(result.error?.message || "Gagal mengunggah foto.");
    return;
   }

   onChange(type === "groom" ? { groom_photo_url: result.data.url } : { bride_photo_url: result.data.url });
   toast.success("Foto berhasil diunggah.");
  } catch (error) {
   console.error("[editor] upload failed:", error);
   toast.error("Terjadi kesalahan saat mengunggah foto.");
  } finally {
   setIsUploading(null);
   if (type === "groom" && groomInputRef.current) groomInputRef.current.value = "";
   if (type === "bride" && brideInputRef.current) brideInputRef.current.value = "";
  }
 }

 return (
  <div className="space-y-8">
   <div className="space-y-4 rounded-lg border p-4">
    <h3 className="font-semibold text-lg text-landing-maroon">Mempelai Pria</h3>
    <div className="grid gap-4 ">
     <div className="space-y-2">
      <Label>Nama Lengkap</Label>
      <Input value={data.groom_full_name || ""} onChange={(e) => onChange({ groom_full_name: e.target.value })} />
     </div>
     <div className="space-y-2">
      <Label>Nama Ayah</Label>
      <Input value={data.groom_father_name || ""} onChange={(e) => onChange({ groom_father_name: e.target.value })} />
     </div>
     <div className="space-y-2">
      <Label>Nama Ibu</Label>
      <Input value={data.groom_mother_name || ""} onChange={(e) => onChange({ groom_mother_name: e.target.value })} />
     </div>
     <div className="space-y-2 ">
      <Label>Foto Profil Pria</Label>
      <div className="flex items-center gap-4">
       {data.groom_photo_url && <img src={data.groom_photo_url} alt="Groom" className="h-16 w-16 rounded-full object-cover" />}
       <input ref={groomInputRef} type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0] ?? null, "groom")} className="hidden" />
       <Button variant="secondary" type="button" onClick={() => groomInputRef.current?.click()} disabled={isUploading === "groom"}>
        {isUploading === "groom" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        Ganti Foto
       </Button>
      </div>
     </div>
    </div>
   </div>

   <div className="space-y-4 rounded-lg border p-4">
    <h3 className="font-semibold text-lg text-landing-maroon">Mempelai Wanita</h3>
    <div className="grid gap-4 ">
     <div className="space-y-2">
      <Label>Nama Lengkap</Label>
      <Input value={data.bride_full_name || ""} onChange={(e) => onChange({ bride_full_name: e.target.value })} />
     </div>
     <div className="space-y-2">
      <Label>Nama Ayah</Label>
      <Input value={data.bride_father_name || ""} onChange={(e) => onChange({ bride_father_name: e.target.value })} />
     </div>
     <div className="space-y-2">
      <Label>Nama Ibu</Label>
      <Input value={data.bride_mother_name || ""} onChange={(e) => onChange({ bride_mother_name: e.target.value })} />
     </div>
     <div className="space-y-2 ">
      <Label>Foto Profil Wanita</Label>
      <div className="flex items-center gap-4">
       {data.bride_photo_url && <img src={data.bride_photo_url} alt="Bride" className="h-16 w-16 rounded-full object-cover" />}
       <input ref={brideInputRef} type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0] ?? null, "bride")} className="hidden" />
       <Button variant="secondary" type="button" onClick={() => brideInputRef.current?.click()} disabled={isUploading === "bride"}>
        {isUploading === "bride" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        Ganti Foto
       </Button>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}

"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import type { SectionFormProps } from "./types";

export function InformasiDasarSection({ data, onChange }: SectionFormProps) {
 const url = `undang.io/invite/${data.slug || ""}`;
 const copyToClipboard = () => {
  navigator.clipboard.writeText(url);
  toast.success("URL disalin!");
 };

 return (
  <div className="space-y-6">
   <div className="space-y-2">
    <Label>Panggilan Pria</Label>
    <Input value={data.groom_nickname || ""} onChange={(e) => onChange({ groom_nickname: e.target.value })} />
   </div>
   <div className="space-y-2">
    <Label>Panggilan Wanita</Label>
    <Input value={data.bride_nickname || ""} onChange={(e) => onChange({ bride_nickname: e.target.value })} />
   </div>
   <div className="space-y-2">
    <Label>Status Undangan</Label>
    <Select value={data.status || "draft"} onChange={(e) => onChange({ status: e.target.value })}>
     <option value="draft">Draft</option>
     <option value="active">Aktif (Publik)</option>
     <option value="nonaktif">Nonaktif</option>
    </Select>
   </div>
   <div className="space-y-2">
    <Label>URL Undangan Publik</Label>
    <div className="flex gap-2">
     <Input value={url} readOnly className="bg-muted text-muted-foreground" />
     <Button variant="secondary" className="w-8 h-8 p-0" onClick={copyToClipboard} type="button">
      <Copy className="h-4 w-4" />
     </Button>
    </div>
   </div>
  </div>
 );
}

"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SectionFormProps } from "./types";

export function AyatQuoteSection({ data, onChange }: SectionFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Teks Ayat / Quote</Label>
        <Textarea rows={5} value={data.quote_text || ""} onChange={(e) => onChange({ quote_text: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Sumber Referensi</Label>
        <Input placeholder="QS. Ar-Rum: 21" value={data.quote_source || ""} onChange={(e) => onChange({ quote_source: e.target.value })} />
      </div>
    </div>
  );
}

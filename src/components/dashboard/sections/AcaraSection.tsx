"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SectionFormProps } from "./types";

export function AcaraSection({ data, onChange }: SectionFormProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold text-lg text-landing-maroon">Akad Nikah / Pemberkatan</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Tanggal & Waktu</Label>
            <Input type="datetime-local" value={data.akad_datetime || ""} onChange={(e) => onChange({ akad_datetime: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Nama Gedung/Tempat</Label>
            <Input value={data.akad_location_name || ""} onChange={(e) => onChange({ akad_location_name: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Alamat Lengkap</Label>
            <Textarea value={data.akad_location_address || ""} onChange={(e) => onChange({ akad_location_address: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Link Google Maps</Label>
            <Input value={data.akad_maps_url || ""} onChange={(e) => onChange({ akad_maps_url: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold text-lg text-landing-maroon">Resepsi</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Tanggal & Waktu</Label>
            <Input type="datetime-local" value={data.resepsi_datetime || ""} onChange={(e) => onChange({ resepsi_datetime: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Nama Gedung/Tempat</Label>
            <Input value={data.resepsi_location_name || ""} onChange={(e) => onChange({ resepsi_location_name: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Alamat Lengkap</Label>
            <Textarea value={data.resepsi_location_address || ""} onChange={(e) => onChange({ resepsi_location_address: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Link Google Maps</Label>
            <Input value={data.resepsi_maps_url || ""} onChange={(e) => onChange({ resepsi_maps_url: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold text-lg text-landing-maroon">Dress Code (Opsional)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Warna</Label>
            <Input value={data.dresscode_colors || ""} onChange={(e) => onChange({ dresscode_colors: e.target.value })} placeholder="Putih, Gold" />
          </div>
          <div className="space-y-2">
            <Label>Catatan Tambahan</Label>
            <Input value={data.dresscode_note || ""} onChange={(e) => onChange({ dresscode_note: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}

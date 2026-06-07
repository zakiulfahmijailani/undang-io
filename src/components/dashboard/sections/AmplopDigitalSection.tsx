"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { SectionFormProps } from "./types";

export function AmplopDigitalSection({ data, onChange }: SectionFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Tampilkan Amplop Digital</Label>
          <p className="text-sm text-muted-foreground">Tamu dapat melihat rekening dan alamat hadiah</p>
        </div>
        <Switch checked={data.show_gift_section !== false} onCheckedChange={(c) => onChange({ show_gift_section: c })} />
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold text-lg">Transfer Bank</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nama Bank</Label>
            <Input value={data.gift_bank_name || ""} onChange={(e) => onChange({ gift_bank_name: e.target.value })} placeholder="BCA / Mandiri" />
          </div>
          <div className="space-y-2">
            <Label>Nomor Rekening</Label>
            <Input value={data.gift_bank_account || ""} onChange={(e) => onChange({ gift_bank_account: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Nama Pemilik Rekening</Label>
            <Input value={data.gift_bank_account_name || ""} onChange={(e) => onChange({ gift_bank_account_name: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold text-lg">QRIS</h3>
        <div className="space-y-2">
          <Label>Nomor / ID QRIS</Label>
          <Input value={data.qris_account || ""} onChange={(e) => onChange({ qris_account: e.target.value })} />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold text-lg">Kirim Hadiah Fisik</h3>
        <div className="space-y-2">
          <Label>Alamat Pengiriman</Label>
          <Textarea value={data.gift_shipping_address || ""} onChange={(e) => onChange({ gift_shipping_address: e.target.value })} rows={3} />
        </div>
      </div>
    </div>
  );
}

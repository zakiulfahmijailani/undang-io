"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SectionFormProps } from "./types";

export function MusikSection({ data, onChange }: SectionFormProps) {
 return (
  <div className="space-y-6">
   <div className="space-y-2">
    <Label>URL Musik (MP3)</Label>
    <Input 
     placeholder="https://example.com/music.mp3" 
     value={data.music_url || ""} 
     onChange={(e) => onChange({ music_url: e.target.value })} 
    />
    <p className="text-xs text-muted-foreground">Gunakan link MP3 yang bisa diakses publik</p>
   </div>
   
   {data.music_url && (
    <div className="mt-4">
     <audio controls src={data.music_url} className="w-full mt-2" />
    </div>
   )}
  </div>
 );
}

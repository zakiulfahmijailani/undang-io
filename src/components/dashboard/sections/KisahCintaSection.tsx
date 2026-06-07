"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import type { SectionFormProps } from "./types";

export function KisahCintaSection({ data, onChange }: SectionFormProps) {
 const stories = data.love_story || [];

 const updateStory = (index: number, field: string, value: string) => {
  const next = [...stories];
  next[index] = { ...next[index], [field]: value };
  onChange({ love_story: next });
 };

 const removeStory = (index: number) => {
  const next = [...stories];
  next.splice(index, 1);
  onChange({ love_story: next });
 };

 const addStory = () => {
  onChange({ love_story: [...stories, { year: "", title: "", description: "" }] });
 };

 return (
  <div className="space-y-6">
   {stories.map((story, i) => (
    <div key={i} className="relative rounded-lg border bg-landing-cream p-4 space-y-4">
     <Button variant="ghost" className="w-8 h-8 p-0 absolute right-2 top-2" onClick={() => removeStory(i)}>
      <X className="h-4 w-4" />
     </Button>
     <div className="flex justify-between items-center">
      <h4 className="font-semibold text-sm">Cerita {i + 1}</h4>
     </div>
     <div className="grid gap-4 ">
      <div className="space-y-2">
       <Label>Tanggal / Tahun</Label>
       <Input type="text" placeholder="2022" value={story.year || ""} onChange={(e) => updateStory(i, "year", e.target.value)} />
      </div>
      <div className="space-y-2">
       <Label>Judul Singkat</Label>
       <Input value={story.title || ""} onChange={(e) => updateStory(i, "title", e.target.value)} />
      </div>
      <div className="space-y-2 ">
       <Label>Deskripsi Cerita</Label>
       <Textarea rows={3} value={story.description || ""} onChange={(e) => updateStory(i, "description", e.target.value)} />
      </div>
     </div>
    </div>
   ))}
   <Button type="button" variant="secondary" className="w-full" onClick={addStory}>
    <Plus className="h-4 w-4 mr-2" />
    Tambah Cerita
   </Button>
  </div>
 );
}

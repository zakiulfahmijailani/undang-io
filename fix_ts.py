import re

# Fix InvitationEditorForm
with open("src/components/dashboard/InvitationEditorForm.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('icon: <Info className="w-4 h-4" />', 'icon: Info')
text = text.replace('icon: <ImageIcon className="w-4 h-4" />', 'icon: ImageIcon')
text = text.replace('icon: <Users className="w-4 h-4" />', 'icon: Users')
text = text.replace('icon: <BookOpen className="w-4 h-4" />', 'icon: BookOpen')
text = text.replace('icon: <Heart className="w-4 h-4" />', 'icon: Heart')
text = text.replace('icon: <Calendar className="w-4 h-4" />', 'icon: Calendar')
text = text.replace('icon: <GalleryHorizontal className="w-4 h-4" />', 'icon: GalleryHorizontal')
text = text.replace('icon: <Gift className="w-4 h-4" />', 'icon: Gift')
text = text.replace('icon: <Music className="w-4 h-4" />', 'icon: Music')

with open("src/components/dashboard/InvitationEditorForm.tsx", "w", encoding="utf-8") as f:
    f.write(text)

# Fix InformasiDasarSection
with open("src/components/dashboard/sections/InformasiDasarSection.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";', 'import { Select } from "@/components/ui/select";')
text = text.replace('size="icon"', 'className="w-8 h-8 p-0"')
text = text.replace('''<Select value={data.status || "draft"} onValueChange={(val) => onChange({ status: val })}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Aktif (Publik)</SelectItem>
            <SelectItem value="nonaktif">Nonaktif</SelectItem>
          </SelectContent>
        </Select>''', '''<Select value={data.status || "draft"} onChange={(e) => onChange({ status: e.target.value })}>
          <option value="draft">Draft</option>
          <option value="active">Aktif (Publik)</option>
          <option value="nonaktif">Nonaktif</option>
        </Select>''')

with open("src/components/dashboard/sections/InformasiDasarSection.tsx", "w", encoding="utf-8") as f:
    f.write(text)

# Fix other sections variant="outline" to variant="secondary"
for file in ["DataMempelaiSection.tsx", "FotoCoverSection.tsx", "GallerySection.tsx", "KisahCintaSection.tsx", "InformasiDasarSection.tsx"]:
    with open(f"src/components/dashboard/sections/{file}", "r", encoding="utf-8") as f:
        text = f.read()
    text = text.replace('variant="outline"', 'variant="secondary"')
    text = text.replace('size="icon"', 'className="w-8 h-8 p-0"')
    with open(f"src/components/dashboard/sections/{file}", "w", encoding="utf-8") as f:
        f.write(text)

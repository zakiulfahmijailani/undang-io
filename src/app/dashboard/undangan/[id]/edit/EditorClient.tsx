/**
 * EditorClient.tsx
 * Stub re-export untuk preview/page.tsx
 * File asli ada di @/components/dashboard/InvitationEditorForm
 * TODO: Ganti dengan implementasi full editor client jika diperlukan
 */

'use client';

export type InvitationEditorInitialData = {
  id: string;
  slug: string;
  status: string;
  created_at: string;
  couple_photo_url: string | null;
  groom_full_name: string | null;
  groom_nickname: string | null;
  groom_father_name: string | null;
  groom_mother_name: string | null;
  bride_full_name: string | null;
  bride_nickname: string | null;
  bride_father_name: string | null;
  bride_mother_name: string | null;
  akad_datetime: string | null;
  akad_location_name: string | null;
  akad_location_address: string | null;
  resepsi_datetime: string | null;
  resepsi_location_name: string | null;
  resepsi_location_address: string | null;
  quote_text: string | null;
  quote_source: string | null;
  music_url: string | null;
  love_story: unknown | null;
  gallery_photos: unknown | null;
  sections_order: unknown | null;
  sections_visibility: unknown | null;
  gift_bank_name: string | null;
  gift_bank_account: string | null;
  gift_bank_account_name: string | null;
  gift_shipping_address: string | null;
  show_couple_photos: boolean;
  show_prewed_gallery: boolean;
  show_gift_section: boolean;
};

interface EditorClientProps {
  initialData: InvitationEditorInitialData;
}

export default function EditorClient({ initialData }: EditorClientProps) {
  return (
    <div className="p-6 text-sm text-stone-500">
      <p className="font-medium text-stone-700 mb-1">Editor Panel</p>
      <p>ID: {initialData.id}</p>
      <p>Slug: {initialData.slug}</p>
      <p className="mt-4 text-xs text-stone-400">
        TODO: Implementasi full editor di sini.
      </p>
    </div>
  );
}

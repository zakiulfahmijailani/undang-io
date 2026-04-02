/**
 * POST /api/admin/upload-theme-asset
 *
 * Server-side upload handler for theme assets.
 * Uses getAdminClient() (SERVICE_ROLE_KEY) to:
 *   1. Verify the user session — must be authenticated
 *   2. Check role in public.profiles — must be 'admin' or 'owner'
 *   3. Upload the file to Supabase Storage bucket 'theme-assets'
 *   4. Insert a row into public.theme_assets
 *
 * This bypasses Storage RLS entirely on the server side, which is safe
 * because we enforce auth + role checks before any storage operation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const ALLOWED_AUDIO_EXTS = ['.mp3', '.ogg', '.wav', '.m4a'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const BUCKET = 'theme-assets';

function getExt(filename: string): string {
  return filename.substring(filename.lastIndexOf('.')).toLowerCase();
}

/**
 * Verifies the request comes from an authenticated user with role 'admin' or 'owner'.
 * Returns the user object if authorized, null otherwise.
 */
async function requireAdminUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('[upload-theme-asset] No authenticated user:', authError?.message);
    return null;
  }

  const admin = getAdminClient();
  if (!admin) {
    console.error('[upload-theme-asset] Admin client unavailable — check SUPABASE_SERVICE_ROLE_KEY env var.');
    return null;
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('[upload-theme-asset] Failed to read profiles.role:', profileError.message);
    return null;
  }

  if (!profile) {
    console.warn(`[upload-theme-asset] No profiles row for user ${user.id}. Denied.`);
    return null;
  }

  if (!['admin', 'owner'].includes(profile.role)) {
    console.warn(`[upload-theme-asset] User ${user.id} has role "${profile.role}" — not authorized.`);
    return null;
  }

  return user;
}

export async function POST(req: NextRequest) {
  // 1. Auth + role guard — only admin/owner
  const user = await requireAdminUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized: hanya admin atau owner yang dapat mengupload aset tema.' },
      { status: 401 }
    );
  }

  const admin = getAdminClient()!;

  // 2. Parse multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const label = (formData.get('label') as string | null)?.trim();
  const themeKey = (formData.get('theme_key') as string | null)?.trim();
  const kind = (formData.get('kind') as string | null)?.trim();

  // 3. Validate required fields
  if (!file) return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
  if (!label) return NextResponse.json({ error: 'Label wajib diisi' }, { status: 400 });
  if (!themeKey) return NextResponse.json({ error: 'Theme key wajib diisi' }, { status: 400 });
  if (!kind) return NextResponse.json({ error: 'Kind wajib diisi' }, { status: 400 });

  // 4. Validate file type & size
  const ext = getExt(file.name);
  const isAudio = ALLOWED_AUDIO_EXTS.includes(ext);
  const isImage = ALLOWED_IMAGE_EXTS.includes(ext);
  if (!isImage && !isAudio) {
    return NextResponse.json(
      {
        error: `Format tidak didukung. Gunakan: ${[...ALLOWED_IMAGE_EXTS, ...ALLOWED_AUDIO_EXTS].join(', ')}`,
      },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Ukuran file maksimal 10MB' }, { status: 400 });
  }

  // 5. Upload to Storage via admin client (bypasses Storage RLS safely)
  const safeName = file.name.replace(/\s+/g, '_').toLowerCase();
  const storagePath = `${user.id}/${themeKey}/${kind}/${Date.now()}_${safeName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await admin.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (uploadError) {
    console.error('[upload-theme-asset] storage error:', uploadError);
    return NextResponse.json(
      { error: 'Gagal mengupload file ke Storage: ' + uploadError.message },
      { status: 500 }
    );
  }

  // 6. Get public URL
  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(storagePath);
  const publicUrl = urlData.publicUrl;

  // 7. Insert into theme_assets
  const { data: asset, error: insertError } = await admin
    .from('theme_assets')
    .insert({
      theme_key: themeKey,
      kind,
      label,
      image_url: publicUrl,
      is_global: false,
      created_by: user.id,
    })
    .select()
    .single();

  if (insertError) {
    console.error('[upload-theme-asset] db insert error:', insertError);
    return NextResponse.json(
      { error: 'File terupload tapi gagal simpan ke DB: ' + insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: asset, url: publicUrl }, { status: 200 });
}

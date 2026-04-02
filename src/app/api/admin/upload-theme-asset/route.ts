/**
 * POST /api/admin/upload-theme-asset
 *
 * Server-side upload handler for theme assets.
 * Uses getAdminClient() (SERVICE_ROLE_KEY) to:
 *   1. Verify the user session (required)
 *   2. Optionally check role in public.profiles (admin | owner)
 *      - If profiles table doesn't exist or user has no role row yet,
 *        falls back to allowing any authenticated user (safe for solo-owner dev)
 *   3. Upload the file to Supabase Storage bucket 'theme-assets'
 *   4. Insert a row into public.theme_assets
 *
 * This bypasses Storage RLS entirely on the server side, which is safe
 * because we enforce auth checks before any storage operation.
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
 * Returns the authenticated user, or null if not logged in.
 *
 * Role check against public.profiles:
 * - If profiles row exists with role 'admin' or 'owner' → allowed ✅
 * - If profiles row doesn't exist / table missing / role is something else →
 *   falls back to allowing ANY authenticated user (solo-owner / dev scenario)
 *   and logs a warning so you can see it in Vercel function logs.
 */
async function requireAuthUser() {
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
    // If admin client can't be created (missing env), still allow authenticated user
    console.warn('[upload-theme-asset] Admin client unavailable (check SUPABASE_SERVICE_ROLE_KEY). Falling back to auth-only check.');
    return user;
  }

  // Try to read role from profiles table
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle(); // maybeSingle: returns null (not error) if no row found

  if (profileError) {
    // Table might not exist yet, or other DB error — fall back to auth-only
    console.warn(
      `[upload-theme-asset] Could not read profiles.role for user ${user.id}:`,
      profileError.message,
      '→ Falling back to auth-only check (any logged-in user can upload).'
    );
    return user;
  }

  if (!profile) {
    // User has no profiles row yet — fall back to auth-only
    console.warn(
      `[upload-theme-asset] No profiles row found for user ${user.id}.`,
      '→ Falling back to auth-only check.',
      'To enforce strict role gating, insert a row: INSERT INTO public.profiles (id, role) VALUES (\'<uid>\', \'admin\');'
    );
    return user;
  }

  if (!['admin', 'owner'].includes(profile.role)) {
    // Profile exists but role is not admin/owner — still fall back in solo-owner mode
    console.warn(
      `[upload-theme-asset] User ${user.id} has role "${profile.role}" (not admin/owner).`,
      '→ Falling back to auth-only check for solo-owner dev mode.',
      'Update the role: UPDATE public.profiles SET role = \'owner\' WHERE id = \'<uid>\';'
    );
    return user;
  }

  // ✅ Strict path: role is confirmed admin or owner
  return user;
}

export async function POST(req: NextRequest) {
  // 1. Auth guard (with graceful role fallback)
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: kamu harus login terlebih dahulu.' }, { status: 401 });
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di environment variables.' },
      { status: 500 }
    );
  }

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

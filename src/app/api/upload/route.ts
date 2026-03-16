import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET = 'invitation-media';

function getExt(filename: string): string {
    return filename.substring(filename.lastIndexOf('.')).toLowerCase();
}

// POST /api/upload
// Uploads a cover/couple photo to Supabase Storage and updates
// the invitation's couple_photo_url column.
export async function POST(request: NextRequest) {
    try {
        // 1. Auth check
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Login diperlukan' } }, { status: 401 });
        }

        // 2. Parse form data
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const invitationId = formData.get('invitation_id') as string | null;
        const type = (formData.get('type') as string | null) || 'cover';

        if (!file) {
            return NextResponse.json({ data: null, error: { code: 'NO_FILE', message: 'File tidak ditemukan' } }, { status: 400 });
        }
        if (!invitationId) {
            return NextResponse.json({ data: null, error: { code: 'NO_INVITATION_ID', message: 'invitation_id diperlukan' } }, { status: 400 });
        }

        // 3. Validate file
        const ext = getExt(file.name);
        if (!ALLOWED_IMAGE_EXTS.includes(ext)) {
            return NextResponse.json({ data: null, error: { code: 'INVALID_TYPE', message: `Format tidak didukung. Gunakan: ${ALLOWED_IMAGE_EXTS.join(', ')}` } }, { status: 400 });
        }
        if (file.size > MAX_IMAGE_SIZE) {
            return NextResponse.json({ data: null, error: { code: 'FILE_TOO_LARGE', message: 'Ukuran file maksimal 5MB' } }, { status: 400 });
        }

        // 4. Ownership check — user must own this invitation
        const { data: invitation, error: invError } = await supabase
            .from('invitations')
            .select('id')
            .eq('id', invitationId)
            .eq('user_id', user.id)
            .single();
        if (invError || !invitation) {
            return NextResponse.json({ data: null, error: { code: 'FORBIDDEN', message: 'Undangan tidak ditemukan atau bukan milik Anda' } }, { status: 403 });
        }

        // 5. Upload to Supabase Storage via admin client
        const adminClient = getAdminClient();
        if (!adminClient) {
            return NextResponse.json({ data: null, error: { code: 'CONFIG_ERROR', message: 'Storage tidak terkonfigurasi' } }, { status: 500 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const timestamp = Date.now();
        const storageKey = `${invitationId}/${type}-${timestamp}${ext}`;

        const { error: uploadError } = await adminClient.storage
            .from(BUCKET)
            .upload(storageKey, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            console.error('[upload] storage upload error:', uploadError);
            return NextResponse.json({ data: null, error: { code: 'UPLOAD_FAILED', message: 'Gagal mengupload ke storage: ' + uploadError.message } }, { status: 500 });
        }

        // 6. Get public URL
        const { data: publicUrlData } = adminClient.storage
            .from(BUCKET)
            .getPublicUrl(storageKey);

        const publicUrl = publicUrlData.publicUrl;

        // 7. Update couple_photo_url in invitations table
        const columnToUpdate = type === 'cover' ? 'couple_photo_url' : 'couple_photo_url';
        const { error: updateError } = await supabase
            .from('invitations')
            .update({ [columnToUpdate]: publicUrl })
            .eq('id', invitationId)
            .eq('user_id', user.id);

        if (updateError) {
            console.error('[upload] db update error:', updateError);
            // Still return the URL even if DB update fails — client can retry
        }

        return NextResponse.json({
            data: { url: publicUrl, key: storageKey },
            error: null,
        });

    } catch (error) {
        console.error('[upload] unexpected error:', error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: 'Gagal mengupload file' } }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Allowed file extensions by category
const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const ALLOWED_AUDIO_EXTS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
const ALLOWED_VIDEO_EXTS = ['.mp4', '.webm', '.mov'];

// Size limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

function getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.')).toLowerCase();
}

function validateFile(file: File, type: string): { valid: boolean; error?: string } {
    const ext = getFileExtension(file.name);

    if (type === 'themes' || type === 'invitations' || type === 'avatars') {
        // Images
        if (!ALLOWED_IMAGE_EXTS.includes(ext)) {
            return { valid: false, error: `Tipe file tidak didukung. Gunakan: ${ALLOWED_IMAGE_EXTS.join(', ')}` };
        }
        if (file.size > MAX_IMAGE_SIZE) {
            return { valid: false, error: `Ukuran file terlalu besar. Maksimal ${MAX_IMAGE_SIZE / 1024 / 1024}MB` };
        }
    } else if (type === 'themes/music') {
        if (!ALLOWED_AUDIO_EXTS.includes(ext)) {
            return { valid: false, error: `Tipe file audio tidak didukung. Gunakan: ${ALLOWED_AUDIO_EXTS.join(', ')}` };
        }
        if (file.size > MAX_AUDIO_SIZE) {
            return { valid: false, error: `Ukuran file audio terlalu besar. Maksimal ${MAX_AUDIO_SIZE / 1024 / 1024}MB` };
        }
    } else if (type === 'themes/videos') {
        if (!ALLOWED_VIDEO_EXTS.includes(ext)) {
            return { valid: false, error: `Tipe file video tidak didukung. Gunakan: ${ALLOWED_VIDEO_EXTS.join(', ')}` };
        }
        if (file.size > MAX_VIDEO_SIZE) {
            return { valid: false, error: `Ukuran file video terlalu besar. Maksimal ${MAX_VIDEO_SIZE / 1024 / 1024}MB` };
        }
    }

    return { valid: true };
}

// POST /api/upload
// Endpoint API lokal untuk development. JANGAN gunakan ini di production
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string;
        const slug = formData.get("slug") as string | null;

        if (!file) {
            return NextResponse.json({ data: null, error: { code: "NO_FILE", message: "File tidak ditemukan" } }, { status: 400 });
        }

        if (!type) {
            return NextResponse.json({ data: null, error: { code: "NO_TYPE", message: "Type upload tidak disertakan" } }, { status: 400 });
        }

        // Validate file
        const validation = validateFile(file, type);
        if (!validation.valid) {
            return NextResponse.json({ data: null, error: { code: "VALIDATION_ERROR", message: validation.error! } }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Tentukan folder penyimpanan berdasarkan type dan opsional slug
        let relativePath = type;
        if (type === "invitations" && slug) {
            relativePath = path.join(type, slug);
        } else if (type === "themes") {
            relativePath = path.join(type, "images");
        } else if (type === "themes/music") {
            relativePath = path.join("themes", "music");
        } else if (type === "themes/videos") {
            relativePath = path.join("themes", "videos");
        }

        const publicPath = path.join(process.cwd(), "public", "uploads", relativePath);

        // Ensure directory exists
        await mkdir(publicPath, { recursive: true });

        // Sanitasi nama file dan tambahkan timestamp
        const ext = file.name.substring(file.name.lastIndexOf('.'));
        const safeBaseName = file.name.substring(0, file.name.lastIndexOf('.')).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
        const filename = `${Date.now()}-${safeBaseName}${ext}`;
        const savePath = path.join(publicPath, filename);

        // Tulis ke filesystem
        await writeFile(savePath, buffer);

        // Return relative URL untuk di-load client - replace Windows separators to URL slashes
        const fileUrl = `/uploads/${relativePath.replace(/\\/g, '/')}/${filename}`;

        return NextResponse.json({
            data: {
                url: fileUrl,
                filename: filename,
                size: file.size,
                type: file.type,
            },
            error: null
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ data: null, error: { code: "INTERNAL_ERROR", message: "Gagal mengupload file" } }, { status: 500 });
    }
}

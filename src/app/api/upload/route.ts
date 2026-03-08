import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

// Endpoint API sederhana untuk menangani upload file statis secara lokal di Vercel/Localhost
// Pada produksi skala besar (mis. S3/Supabase Storage), script ini perlu diganti.
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "misc"; // misalnya: "themes/images" atau "invitations"

        if (!file) {
            return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitasi nama file dan susun direktori penyimpanannya
        const filename = file.name.replace(/\s+/g, '-').toLowerCase();
        const publicPath = path.join(process.cwd(), "public", "uploads", folder);
        const savePath = path.join(publicPath, filename);

        // Tulis ke filesystem
        await writeFile(savePath, buffer);

        // Return relative URL untuk di-load client 
        const fileUrl = `/uploads/${folder}/${filename}`;

        return NextResponse.json({ url: fileUrl, success: true });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Gagal mengupload file" }, { status: 500 });
    }
}

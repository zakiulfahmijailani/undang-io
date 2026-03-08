import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ invitationId: string }> }
) {
    try {
        const resolvedParams = await params;
        const body = await request.json();
        const { name, attendance, message, guestCount } = body;

        // Validate
        if (!name || !attendance) {
            return NextResponse.json({ error: "Nama dan konfirmasi kehadiran wajib diisi" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Ignore
                        }
                    },
                },
            }
        );

        const { data, error } = await supabase
            .from("rsvp_messages")
            .insert([{
                invitation_id: resolvedParams.invitationId,
                guest_name: name,
                attendance_status: attendance,
                message_text: message,
                guest_count: guestCount || 1
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error submitting RSVP:", error);
        return NextResponse.json(
            { error: "Gagal mengirim ucapan & konfirmasi" },
            { status: 500 }
        );
    }
}

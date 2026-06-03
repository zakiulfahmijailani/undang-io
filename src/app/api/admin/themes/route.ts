import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    try {
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
                            // Ignore in Server Components
                        }
                    },
                },
            }
        );

        const { data: themes, error } = await supabase
            .from("classic_themes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json(themes);
    } catch (error) {
        console.error("Error fetching themes:", error);
        return NextResponse.json(
            { error: "Gagal memuat tema" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

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
                            // Ignore in Server Components
                        }
                    },
                },
            }
        );

        // TODO: Verify if the user is an admin here

        const { data, error } = await supabase
            .from("classic_themes")
            .insert([{
                name: body.name,
                slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
                description: body.description,
                cultural_category: body.cultural_category || 'general',
                status: 'draft',
                is_published: false,
                config: {},
                assets: {},
                colors: {},
                typography: {},
                animation_settings: {}
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error creating theme:", error);
        return NextResponse.json(
            { error: "Gagal membuat tema" },
            { status: 500 }
        );
    }
}

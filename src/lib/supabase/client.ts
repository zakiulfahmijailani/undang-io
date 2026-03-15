import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return null as any
    }

    return createBrowserClient(supabaseUrl, supabaseKey)
}

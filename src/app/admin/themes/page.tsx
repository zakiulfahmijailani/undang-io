import { createServerSupabaseClient } from '@/lib/supabase/server'
import AdminThemesClient from './components/AdminThemesClient'

export default async function AdminThemesPage() {
    const supabase = await createServerSupabaseClient()

    const { data: themes, error } = await supabase
        .from('themes')
        .select('id, name, slug, description, thumbnail_url, status, is_active, is_published, cultural_category, created_at, tags')
        .order('created_at', { ascending: false })

    return <AdminThemesClient initialThemes={themes ?? []} fetchError={error?.message ?? null} />
}

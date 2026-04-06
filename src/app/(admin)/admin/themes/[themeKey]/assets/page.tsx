import { notFound, redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ThemeAssetDashboard } from './_components/theme-asset-dashboard'

export default async function ThemeAssetsPage({ params }: { params: Promise<{ themeKey: string }> }) {
  const resolvedParams = await params;
  const supabase = await createServerSupabaseClient()

  // Auth Guard
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user || user.user_metadata?.role !== 'superadmin') {
    redirect('/login')
  }

  // Fetch Theme
  const { data: theme, error: themeError } = await supabase
    .from('themes')
    .select('*')
    .eq('theme_key', resolvedParams.themeKey)
    .single()

  if (themeError || !theme) {
    notFound()
  }

  // Fetch Assets
  const { data: assets } = await supabase
    .from('theme_assets')
    .select('*')
    .eq('theme_key', resolvedParams.themeKey)

  return (
    <ThemeAssetDashboard theme={theme} assets={assets || []} />
  )
}

import { notFound, redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ThemeAssetDashboard } from '@/app/dashboard/themes/[themeKey]/assets/_components/theme-asset-dashboard'

export default async function DashboardThemeAssetsPage({
  params,
}: {
  params: Promise<{ themeKey: string }>
}) {
  const { themeKey } = await params
  const supabase = await createServerSupabaseClient()

  // Auth Guard — real Supabase auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'owner'].includes(profile.role)) {
    redirect('/dashboard')
  }

  // Fetch Theme — using `slug` (the correct DB column)
  const { data: theme, error: themeError } = await supabase
    .from('themes')
    .select('*')
    .eq('slug', themeKey)
    .single()

  if (themeError || !theme) {
    notFound()
  }

  // Fetch Assets — theme_key in theme_assets still maps to slug value
  const { data: assets } = await supabase
    .from('theme_assets')
    .select('*')
    .eq('theme_key', themeKey)

  return (
    <ThemeAssetDashboard theme={theme} assets={assets || []} />
  )
}

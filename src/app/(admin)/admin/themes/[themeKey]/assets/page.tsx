import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ThemeAssetDashboard } from './_components/theme-asset-dashboard'

export default async function ThemeAssetsPage({ params }: { params: Promise<{ themeKey: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

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
  const { data: assets, error: assetsError } = await supabase
    .from('theme_assets')
    .select('*')
    .eq('theme_key', resolvedParams.themeKey)

  return (
    <ThemeAssetDashboard theme={theme} assets={assets || []} />
  )
}

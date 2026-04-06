import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CreateThemeModal } from './_components/create-theme-modal'
import { Image as ImageIcon } from 'lucide-react'

export const metadata = {
  title: 'Kelola Tema — undang.io Dashboard',
}

export default async function DashboardThemesPage() {
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
  const { data: themes, error } = await supabase
    .from('themes')
    .select(`
      *,
      theme_assets (slot, file_url)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[dashboard/themes] Error fetching themes:', error)
  }

  const TOTAL_SLOTS = 16

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E5E5E5] -m-5 md:-m-8 p-8 font-sans">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Kelola Tema</h1>
            <p className="text-white/50 text-sm mt-1">Upload aset dan kustomisasi tema undangan</p>
          </div>
          <CreateThemeModal />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {themes?.map((theme: any) => {
            const assetCount = theme.theme_assets?.length || 0
            const progressPct = Math.round((assetCount / TOTAL_SLOTS) * 100)
            const isComplete = assetCount === TOTAL_SLOTS

            const coverAsset = theme.theme_assets?.find((a: any) => a.slot === 'cover_scene')

            return (
              <div key={theme.id} className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden shadow-lg flex flex-col group hover:border-white/20 transition-colors">

                {/* Thumbnail */}
                <div className="w-full h-48 bg-[#111] relative overflow-hidden flex items-center justify-center">
                  {coverAsset?.file_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverAsset.file_url}
                      alt={theme.display_name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-white/20">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs">No Cover</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border shadow-sm backdrop-blur-sm ${
                      theme.is_active
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-700/50'
                    }`}>
                      {theme.is_active ? 'ACTIVE' : 'DRAFT'}
                    </span>
                    {theme.is_premium && (
                      <span className="bg-amber-500/80 text-amber-100 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-amber-500/50 backdrop-blur-sm">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-white truncate text-lg" title={theme.display_name}>
                    {theme.display_name}
                  </h3>
                  <p className="text-xs text-white/50 font-mono mt-1 mb-4 truncate" title={theme.theme_key}>
                    {theme.theme_key}
                  </p>

                  {/* Progress */}
                  <div className="mt-auto pt-2">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/60">Aset Terkumpul</span>
                      <span className={isComplete ? 'text-emerald-400 font-medium' : 'text-white/40'}>
                        {assetCount} / {TOTAL_SLOTS}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-white/30'}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex gap-2">
                    <Link
                      href={`/dashboard/themes/${theme.theme_key}/assets`}
                      className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm text-center py-2 rounded-lg font-medium transition-colors"
                    >
                      Kelola Aset
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}

          {(themes?.length === 0 || !themes) && (
            <div className="col-span-full py-20 text-center text-white/40 border-2 border-dashed border-white/10 rounded-xl">
              <p>Belum ada tema. Klik &quot;Buat Tema Baru&quot; untuk memulai.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

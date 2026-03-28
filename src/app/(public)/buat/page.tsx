import { Suspense } from 'react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ChevronRight } from 'lucide-react';
import { SupabaseThemeRow } from '@/types/theme';

export const metadata = {
  title: 'Pilih Tema Undangan | undang.io',
  description: 'Pilih tema untuk undangan pernikahan digital Anda.',
};

export default async function PilihTemaPage() {
  const supabase = await createServerSupabaseClient();
  const { data: themesData, error } = await supabase
    .from('themes')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const themes = (themesData || []) as SupabaseThemeRow[];

  return (
    <div className="min-h-screen bg-surface-lowest-stitch selection:bg-tertiary-fixed-dim-stitch font-['Inter'] flex flex-col pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full flex-1">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-black text-primary-stitch tracking-tight mb-4">
            Pilih Tema Undangan
          </h1>
          <p className="text-secondary-stitch max-w-xl text-sm lg:text-base leading-relaxed">
            Mulai buat undangan dengan memilih satu dari koleksi tema premium kami. Anda bisa menyesuaikan warna dan font nantinya.
          </p>
        </div>

        {/* Themes Grid */}
        {error ? (
          <div className="p-8 rounded-[2rem] border border-red-200 bg-red-50 text-red-700 text-center">
            Gagal memuat tema. Silakan muat ulang halaman.
          </div>
        ) : themes.length === 0 ? (
          <div className="p-12 rounded-[2.5rem] border-2 border-dashed border-outline-variant-stitch/50 bg-surface-container-lowest-stitch text-center">
            <h3 className="text-lg font-bold text-secondary-stitch">Belum ada tema tersedia</h3>
            <p className="text-outline-stitch mt-2 text-sm">Tema sedang dalam proses perilisan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {themes.map((theme) => (
              <div 
                key={theme.id}
                className="group flex flex-col rounded-[2rem] bg-white border border-outline-variant-stitch/30 shadow-sm hover:shadow-xl hover:border-primary-stitch/30 transition-all duration-500 overflow-hidden"
              >
                {/* Thumbnail Area */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-stitch">
                  {theme.preview_url ? (
                    <img 
                      src={theme.preview_url} 
                      alt={theme.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-stitch to-surface-container-stitch">
                      <span className="text-outline-stitch font-bold tracking-widest text-xs uppercase rotate-[-45deg] opacity-50">
                        No Preview
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay for detail readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* Badges / Meta Info */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black tracking-widest uppercase text-primary-stitch shadow-sm border border-white/20">
                      {theme.cultural_category || "Modern"}
                    </span>
                  </div>
                </div>

                {/* Content & Action Area */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="font-bold text-lg text-primary-stitch">
                      {theme.name}
                    </h3>
                    {theme.description && (
                      <p className="text-xs text-secondary-stitch line-clamp-2 mt-1.5 leading-relaxed">
                        {theme.description}
                      </p>
                    )}
                  </div>

                  {/* Button Action */}
                  <div className="mt-auto pt-2">
                    <Link href={`/buat/${theme.id}`} className="w-full group/btn relative overflow-hidden rounded-xl bg-primary-stitch text-white px-5 py-3.5 text-sm font-bold shadow-md shadow-primary-stitch/20 hover:shadow-lg hover:shadow-primary-stitch/30 transition-all duration-300 flex items-center justify-center gap-2">
                      <span className="relative z-10">Pilih Tema Ini</span>
                      <ChevronRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 rounded-xl" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

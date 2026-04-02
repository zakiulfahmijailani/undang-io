"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Pencil, Copy, Trash2, Search, Filter, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { CULTURAL_LABELS, CulturalCategory } from '@/types/theme';
import { THEME_SLOT_DEFINITIONS } from '@/data/themeSlots';

type ThemeRow = {
    id: string
    name: string
    slug: string | null
    description: string | null
    thumbnail_url: string | null
    status: string | null
    is_active: boolean | null
    is_published: boolean | null
    cultural_category: string | null
    created_at: string
    tags: string[] | null
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    draft: { label: 'Draft', variant: 'secondary' },
    active: { label: 'Aktif', variant: 'default' },
    archived: { label: 'Diarsipkan', variant: 'destructive' },
};

interface Props {
    initialThemes: ThemeRow[]
    fetchError: string | null
}

export default function AdminThemesClient({ initialThemes, fetchError }: Props) {
    const router = useRouter()
    const supabase = createBrowserSupabaseClient()
    const [themes, setThemes] = useState<ThemeRow[]>(initialThemes)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [actionError, setActionError] = useState<string | null>(null)

    const filtered = useMemo(() => {
        return themes.filter((t) => {
            if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
            if (statusFilter !== 'all' && t.status !== statusFilter) return false
            if (categoryFilter !== 'all' && t.cultural_category !== categoryFilter) return false
            return true
        })
    }, [themes, search, statusFilter, categoryFilter])

    const handleDuplicate = async (theme: ThemeRow) => {
        setActionError(null)
        const newSlug = `${theme.slug ?? theme.id}-copy-${Math.random().toString(36).substring(2, 6)}`
        const { data, error } = await supabase
            .from('themes')
            .insert({
                name: `${theme.name} (Salinan)`,
                slug: newSlug,
                description: theme.description,
                thumbnail_url: theme.thumbnail_url,
                status: 'draft',
                is_active: false,
                is_published: false,
                cultural_category: theme.cultural_category,
                tags: theme.tags,
            })
            .select('id, name, slug, description, thumbnail_url, status, is_active, is_published, cultural_category, created_at, tags')
            .single()
        if (error) { setActionError(`Gagal menduplikasi: ${error.message}`); return }
        setThemes((prev) => [data, ...prev])
    }

    const handleDelete = async (id: string) => {
        setActionError(null)
        const { error } = await supabase.from('themes').delete().eq('id', id)
        if (error) { setActionError(`Gagal menghapus: ${error.message}`); return }
        setThemes((prev) => prev.filter((t) => t.id !== id))
    }

    const totalSlots = THEME_SLOT_DEFINITIONS.length

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#14213D]">
                        Kelola Tema
                        <span className="ml-2 text-sm font-normal text-gray-400">({themes.length} tema)</span>
                    </h1>
                    <p className="text-sm text-gray-500">Buat dan kelola tema undangan untuk semua pengguna</p>
                </div>
                <Button onClick={() => router.push('/admin/themes/new')} className="gap-2 bg-[#14213D] hover:bg-[#1a2b50] text-white">
                    <Plus className="w-4 h-4" /> Buat Tema Baru
                </Button>
            </div>

            {(fetchError || actionError) && (
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {fetchError ?? actionError}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Cari tema..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14213D]/30"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm min-w-[140px] focus:outline-none focus:ring-2 focus:ring-[#14213D]/30"
                >
                    <option value="all">Semua Status</option>
                    <option value="draft">Draft</option>
                    <option value="active">Aktif</option>
                    <option value="archived">Diarsipkan</option>
                </select>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#14213D]/30"
                >
                    <option value="all">Semua Kategori</option>
                    {Object.entries(CULTURAL_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <Filter className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-700">Tidak ada tema ditemukan</p>
                    <p className="text-sm text-gray-500">Coba ubah filter atau buat tema baru.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((theme) => {
                        const st = statusLabels[theme.status ?? 'draft'] ?? statusLabels['draft']
                        return (
                            <div key={theme.id} className="rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-[9/16] max-h-48 overflow-hidden bg-gray-100 relative">
                                    {theme.thumbnail_url ? (
                                        <img src={theme.thumbnail_url} alt={theme.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Belum ada thumbnail</div>
                                    )}
                                    <Badge variant={st.variant} className="absolute top-2 right-2">{st.label}</Badge>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-[#14213D] mb-1">{theme.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {theme.cultural_category
                                            ? (CULTURAL_LABELS[theme.cultural_category as CulturalCategory] ?? theme.cultural_category)
                                            : '—'}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{theme.description ?? ''}</p>
                                    <div className="flex gap-2">
                                        <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/themes/${theme.id}/preview`)} className="gap-1 flex-1 text-xs">
                                            <Eye className="w-3 h-3" /> Preview
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/themes/${theme.id}/edit`)} className="gap-1 flex-1 text-xs">
                                            <Pencil className="w-3 h-3" /> Edit
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={() => handleDuplicate(theme)} className="px-2">
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={() => handleDelete(theme.id)} className="px-2 text-red-600 hover:text-red-700">
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

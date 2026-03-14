"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Pencil, Copy, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dummyThemes } from '@/data/dummyThemes';
import { Theme, ThemeStatus, CULTURAL_LABELS, CulturalCategory } from '@/types/theme';
import { THEME_SLOT_DEFINITIONS, REQUIRED_SLOTS_FOR_ACTIVATION } from '@/data/themeSlots';

const statusLabels: Record<ThemeStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    draft: { label: 'Draft', variant: 'secondary' },
    active: { label: 'Aktif', variant: 'default' },
    archived: { label: 'Diarsipkan', variant: 'destructive' },
};

export default function AdminThemesPage() {
    const router = useRouter();
    const [themes, setThemes] = useState<Theme[]>(dummyThemes);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const filtered = useMemo(() => {
        return themes.filter((t) => {
            if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
            if (statusFilter !== 'all' && t.status !== statusFilter) return false;
            if (categoryFilter !== 'all' && t.culturalCategory !== categoryFilter) return false;
            return true;
        });
    }, [themes, search, statusFilter, categoryFilter]);

    const getFilledSlotCount = (theme: Theme) => {
        return theme.assetSlots.filter((s) => s.assetUrl !== null).length;
    };

    const handleDuplicate = (theme: Theme) => {
        const newTheme: Theme = {
            ...theme,
            id: `theme-copy-${Date.now()}`,
            name: `${theme.name} (Salinan)`,
            slug: `${theme.slug}-copy-${Math.random().toString(36).substring(2, 6)}`,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setThemes((prev) => [newTheme, ...prev]);
    };

    const handleDelete = (id: string) => {
        setThemes((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#14213D]">Kelola Tema</h1>
                    <p className="text-sm text-gray-500">Buat dan kelola tema undangan untuk semua pengguna</p>
                </div>
                <Button onClick={() => router.push('/admin/themes/new')} className="gap-2 bg-[#14213D] hover:bg-[#1a2b50] text-white">
                    <Plus className="w-4 h-4" /> Buat Tema Baru
                </Button>
            </div>

            {/* Filters */}
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

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <Filter className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-700">Tidak ada tema ditemukan</p>
                    <p className="text-sm text-gray-500">Coba ubah filter atau buat tema baru.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((theme) => {
                        const filled = getFilledSlotCount(theme);
                        const total = THEME_SLOT_DEFINITIONS.length;
                        const st = statusLabels[theme.status];
                        return (
                            <div key={theme.id} className="rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Thumbnail */}
                                <div className="aspect-[9/16] max-h-48 overflow-hidden bg-gray-100 relative">
                                    {theme.thumbnailUrl ? (
                                        <img src={theme.thumbnailUrl} alt={theme.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Belum ada thumbnail</div>
                                    )}
                                    <Badge variant={st.variant} className="absolute top-2 right-2">{st.label}</Badge>
                                </div>
                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-[#14213D] mb-1">{theme.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{CULTURAL_LABELS[theme.culturalCategory]}</p>
                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{theme.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                        <span>Slot: {filled}/{total}</span>
                                        <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                            <div className="h-full rounded-full bg-[#14213D] transition-all" style={{ width: `${(filled / total) * 100}%` }} />
                                        </div>
                                    </div>
                                    {/* Actions */}
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
                        );
                    })}
                </div>
            )}
        </div>
    );
}

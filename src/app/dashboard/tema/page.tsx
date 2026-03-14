"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Plus, Star, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dummyThemes, dummyUserPreferences } from '@/data/dummyThemes';
import { Theme, InvitationThemePreference, CULTURAL_LABELS } from '@/types/theme';

export default function UserThemeSelectionPage() {
    const router = useRouter();

    // Available themes (active only)
    const availableThemes = dummyThemes.filter((t) => t.status === 'active');

    // User's selected themes
    const [preferences, setPreferences] = useState<InvitationThemePreference[]>(dummyUserPreferences);

    const selectedThemeIds = new Set(preferences.map((p) => p.themeId));

    const addTheme = (theme: Theme) => {
        if (selectedThemeIds.has(theme.id)) return;
        const newPref: InvitationThemePreference = {
            id: `pref-${Date.now()}`,
            invitationId: 'inv-001',
            themeId: theme.id,
            sortOrder: preferences.length + 1,
            isEnabled: true,
            isPrimary: preferences.length === 0,
            theme,
        };
        setPreferences((prev) => [...prev, newPref]);
    };

    const removeTheme = (prefId: string) => {
        setPreferences((prev) => {
            const updated = prev.filter((p) => p.id !== prefId);
            if (updated.length > 0 && !updated.some((p) => p.isPrimary)) {
                updated[0] = { ...updated[0], isPrimary: true };
            }
            return updated;
        });
    };

    const toggleEnabled = (prefId: string) => {
        setPreferences((prev) => prev.map((p) => p.id === prefId ? { ...p, isEnabled: !p.isEnabled } : p));
    };

    const setPrimary = (prefId: string) => {
        setPreferences((prev) => prev.map((p) => ({ ...p, isPrimary: p.id === prefId })));
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        setPreferences((prev) => {
            const arr = [...prev];
            [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
            return arr.map((p, i) => ({ ...p, sortOrder: i + 1 }));
        });
    };

    const moveDown = (index: number) => {
        if (index >= preferences.length - 1) return;
        setPreferences((prev) => {
            const arr = [...prev];
            [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
            return arr.map((p, i) => ({ ...p, sortOrder: i + 1 }));
        });
    };

    const handleSave = () => {
        // TODO: Save to API when Supabase is configured
        router.push('/dashboard');
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                    </Button>
                    <h1 className="text-2xl font-bold text-foreground">Pilih Tema Undangan</h1>
                </div>
                <Button onClick={handleSave} className="gap-1">
                    <Check className="w-4 h-4" /> Simpan Perubahan
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT: Available themes */}
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Tema Tersedia</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {availableThemes.map((theme) => {
                            const isSelected = selectedThemeIds.has(theme.id);
                            return (
                                <div key={theme.id} className="rounded-xl border bg-card overflow-hidden shadow-sm">
                                    <div className="aspect-[9/16] max-h-40 overflow-hidden bg-muted">
                                        {theme.thumbnailUrl ? (
                                            <img src={theme.thumbnailUrl} alt={theme.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Belum ada preview</div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-foreground text-sm">{theme.name}</h3>
                                        <p className="text-xs text-muted-foreground mb-3">{CULTURAL_LABELS[theme.culturalCategory]}</p>
                                        <div className="flex gap-2">
                                            <Button variant="secondary" size="sm" className="flex-1 gap-1 text-xs"
                                                onClick={() => router.push(`/admin/themes/${theme.id}/preview`)}
                                            >
                                                <Eye className="w-3 h-3" /> Preview
                                            </Button>
                                            <Button size="sm" className="flex-1 gap-1 text-xs" disabled={isSelected}
                                                onClick={() => addTheme(theme)}
                                            >
                                                <Plus className="w-3 h-3" /> {isSelected ? 'Sudah Dipilih' : 'Tambahkan'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: User's selected themes */}
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Tema Pilihan Saya</h2>
                    {preferences.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed border-muted p-12 text-center">
                            <p className="text-muted-foreground">Belum ada tema dipilih</p>
                            <p className="text-xs text-muted-foreground mt-1">Pilih tema dari daftar di sebelah kiri</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {preferences.map((pref, index) => (
                                <div key={pref.id}
                                    className={`rounded-xl border p-4 transition-colors ${pref.isPrimary ? 'border-primary bg-primary/5' : 'bg-card'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Reorder */}
                                        <div className="flex flex-col gap-0.5">
                                            <button onClick={() => moveUp(index)} disabled={index === 0}
                                                className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs"
                                            >▲</button>
                                            <button onClick={() => moveDown(index)} disabled={index === preferences.length - 1}
                                                className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs"
                                            >▼</button>
                                        </div>

                                        {/* Order number */}
                                        <span className="text-sm font-bold text-muted-foreground w-6 text-center">{index + 1}</span>

                                        {/* Thumbnail */}
                                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                                            {pref.theme?.thumbnailUrl && (
                                                <img src={pref.theme.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-foreground text-sm truncate">{pref.theme?.name}</p>
                                                {pref.isPrimary && <Badge className="text-[10px] shrink-0">Utama</Badge>}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{pref.theme ? CULTURAL_LABELS[pref.theme.culturalCategory] : ''}</p>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => toggleEnabled(pref.id)}
                                                className={`w-10 h-6 rounded-full transition-colors relative ${pref.isEnabled ? 'bg-primary' : 'bg-gray-300'}`}
                                            >
                                                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${pref.isEnabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                            </button>
                                            {!pref.isPrimary && (
                                                <Button variant="secondary" size="sm" onClick={() => setPrimary(pref.id)} title="Jadikan Utama">
                                                    <Star className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button variant="secondary" size="sm" onClick={() => removeTheme(pref.id)} className="text-red-600 hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

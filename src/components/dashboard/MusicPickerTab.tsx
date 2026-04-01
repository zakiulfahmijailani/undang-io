"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Loader2, Play, Pause, Check, X, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEDDING_MUSIC, WeddingTrack, MUSIC_UPLOAD_LIMITS } from "@/data/weddingMusic";

interface MusicPickerTabProps {
    invitationId: string;
    currentMusicUrl: string;
    onChange: (url: string) => void;
}

export default function MusicPickerTab({ invitationId, currentMusicUrl, onChange }: MusicPickerTabProps) {
    const [previewingId, setPreviewingId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedName, setUploadedName] = useState<string>('');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isCustom = currentMusicUrl && !WEDDING_MUSIC.find(t => t.url === currentMusicUrl);
    const selectedTrack = WEDDING_MUSIC.find(t => t.url === currentMusicUrl);

    const stopPreview = () => {
        audioRef.current?.pause();
        if (audioRef.current) audioRef.current.currentTime = 0;
        setPreviewingId(null);
    };

    const handlePreview = (e: React.MouseEvent, track: WeddingTrack) => {
        e.stopPropagation();
        if (previewingId === track.id) {
            stopPreview();
            return;
        }
        stopPreview();
        const audio = new Audio(track.url);
        audioRef.current = audio;
        audio.play().catch(() => {
            alert('Gagal memutar preview. URL mungkin tidak tersedia sementara.');
        });
        audio.onended = () => setPreviewingId(null);
        setPreviewingId(track.id);
    };

    const handleSelect = (track: WeddingTrack) => {
        stopPreview();
        onChange(track.url);
    };

    const handleClear = () => {
        stopPreview();
        setUploadedName('');
        onChange('');
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MUSIC_UPLOAD_LIMITS.maxSizeBytes) {
            alert(`Ukuran file maksimal ${MUSIC_UPLOAD_LIMITS.maxSizeMB}MB (sekitar ${MUSIC_UPLOAD_LIMITS.recommendedDurationMin} menit).`);
            return;
        }
        setIsUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('invitation_id', invitationId);
            fd.append('type', 'music');
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const result = await res.json();
            if (!res.ok || result.error) throw new Error(result.error?.message || 'Upload gagal');
            setUploadedName(file.name);
            onChange(result.data.url);
        } catch (err: any) {
            alert('Upload gagal: ' + err.message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        return () => { audioRef.current?.pause(); };
    }, []);

    return (
        <div className="space-y-5 animate-in fade-in">
            <div>
                <h2 className="text-xl font-serif font-bold text-stone-800">Musik Latar</h2>
                <p className="text-sm text-stone-500 mt-1">
                    Musik akan diputar otomatis saat tamu membuka undangan.
                </p>
            </div>

            {/* Status musik aktif */}
            {currentMusicUrl ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Music2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-emerald-800 truncate">
                            {isCustom
                                ? (uploadedName || 'File custom')
                                : selectedTrack?.title}
                        </p>
                        <p className="text-xs text-emerald-600">
                            {isCustom ? 'Upload sendiri' : selectedTrack?.genre}
                        </p>
                    </div>
                    <button
                        onClick={handleClear}
                        className="flex-shrink-0 text-stone-400 hover:text-red-500 transition-colors p-1"
                        title="Hapus musik"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-500">
                    <Music2 className="w-4 h-4" />
                    <span>Belum ada musik dipilih</span>
                </div>
            )}

            {/* Curated list — scrollable */}
            <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">🎵 Koleksi Musik (10 lagu)</p>
                <div className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-200">
                    {WEDDING_MUSIC.map((track) => {
                        const isSelected = currentMusicUrl === track.url;
                        const isPreviewing = previewingId === track.id;
                        return (
                            <div
                                key={track.id}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                                    isSelected
                                        ? 'bg-amber-50 border-amber-300'
                                        : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                                }`}
                            >
                                {/* Emoji */}
                                <span className="text-xl w-9 h-9 flex items-center justify-center bg-stone-100 rounded-lg flex-shrink-0">
                                    {track.coverEmoji}
                                </span>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-stone-800 truncate">{track.title}</p>
                                    <p className="text-xs text-stone-400">{track.genre} · {track.duration}</p>
                                </div>

                                {/* Preview button */}
                                <button
                                    onClick={(e) => handlePreview(e, track)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                                        isPreviewing
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                    }`}
                                    title={isPreviewing ? 'Stop preview' : 'Preview'}
                                >
                                    {isPreviewing
                                        ? <Pause className="w-3.5 h-3.5" />
                                        : <Play className="w-3.5 h-3.5" />}
                                </button>

                                {/* Explicit select button */}
                                <Button
                                    size="sm"
                                    onClick={() => handleSelect(track)}
                                    className={`h-8 px-3 text-xs flex-shrink-0 transition-all ${
                                        isSelected
                                            ? 'bg-amber-500 text-white hover:bg-amber-600 border-0'
                                            : 'bg-white text-stone-700 border border-stone-300 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                                    }`}
                                    variant={isSelected ? 'primary' : 'secondary'}
                                >
                                    {isSelected ? (
                                        <><Check className="w-3 h-3 mr-1" />Dipilih</>
                                    ) : (
                                        'Pilih'
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Custom upload */}
            <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">📁 Upload Musik Sendiri</p>
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                        isUploading
                            ? 'border-amber-300 bg-amber-50 cursor-wait'
                            : 'border-stone-300 hover:border-amber-400 hover:bg-amber-50/40'
                    }`}
                >
                    {isUploading ? (
                        <><Loader2 className="w-6 h-6 text-amber-500 animate-spin" /><p className="text-sm text-amber-700">Mengupload...</p></>
                    ) : (
                        <>
                            <Upload className="w-6 h-6 text-stone-400" />
                            <p className="text-sm font-medium text-stone-700">Klik untuk upload MP3</p>
                            <div className="text-center space-y-0.5">
                                <p className="text-xs text-stone-500">Format: MP3 · Maks. <span className="font-semibold text-stone-700">{MUSIC_UPLOAD_LIMITS.maxSizeMB}MB</span></p>
                                <p className="text-xs text-stone-400">Disarankan: maks. <span className="font-semibold">{MUSIC_UPLOAD_LIMITS.recommendedDurationMin} menit</span> agar halaman tidak berat</p>
                            </div>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/mpeg,audio/mp3"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                </div>
            </div>

            {/* No music option */}
            {currentMusicUrl && (
                <button
                    onClick={handleClear}
                    className="w-full text-xs text-stone-400 hover:text-red-500 transition-colors py-2"
                >
                    Hapus musik latar
                </button>
            )}
        </div>
    );
}

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
                <div className="flex items-center gap-4 px-5 py-4 bg-tertiary-fixed-dim-stitch/30 border border-outline-variant-stitch/10 rounded-3xl text-sm shadow-inner">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-glow-stitch flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Music2 className="w-5 h-5 text-primary-stitch" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-black text-primary-stitch truncate uppercase tracking-widest text-[10px]">
                            {isCustom
                                ? (uploadedName || 'TITANIUM CUSTOM')
                                : selectedTrack?.title}
                        </p>
                        <p className="text-[10px] text-secondary-stitch/60 font-medium">
                            {isCustom ? 'PRO UPLOAD' : selectedTrack?.genre}
                        </p>
                    </div>
                    <button
                        onClick={handleClear}
                        className="flex-shrink-0 text-secondary-stitch/30 hover:text-error-stitch transition-all p-2 bg-white rounded-full shadow-sm hover:scale-110 active:scale-90"
                        title="Hapus musik"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3 px-5 py-4 bg-surface-container-low-stitch border border-outline-variant-stitch/10 rounded-3xl text-[10px] font-black uppercase tracking-widest text-secondary-stitch/40">
                    <Music2 className="w-4 h-4" />
                    <span>No Soundtrack Selected</span>
                </div>
            )}

            {/* Curated list — scrollable */}
            <div>
                <p className="text-[10px] font-black text-on-tertiary-container-stitch uppercase tracking-[0.2em] mb-3 px-1">🎵 TITANIUM COLLECTION</p>
                <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
                    {WEDDING_MUSIC.map((track) => {
                        const isSelected = currentMusicUrl === track.url;
                        const isPreviewing = previewingId === track.id;
                        return (
                            <div
                                key={track.id}
                                className={`flex items-center gap-3 px-4 py-3 rounded-[24px] border transition-all duration-300 ${
                                    isSelected
                                        ? 'bg-white border-primary-stitch shadow-glow-stitch ring-1 ring-primary-stitch/20'
                                        : 'bg-white border-outline-variant-stitch/10 hover:border-primary-stitch/40 hover:bg-surface-container-low-stitch'
                                }`}
                            >
                                {/* Emoji */}
                                <span className="text-xl w-10 h-10 flex items-center justify-center bg-surface-container-high-stitch rounded-2xl flex-shrink-0 shadow-inner">
                                    {track.coverEmoji}
                                </span>
 
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black text-primary-stitch truncate uppercase tracking-tight">{track.title}</p>
                                    <p className="text-[10px] text-secondary-stitch/60 font-medium">{track.genre} · {track.duration}</p>
                                </div>
 
                                {/* Preview button */}
                                <button
                                    onClick={(e) => handlePreview(e, track)}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-sm ${
                                        isPreviewing
                                            ? 'bg-tertiary-stitch text-white scale-110 rotate-12'
                                            : 'bg-surface-container-high-stitch text-primary-stitch hover:bg-white hover:shadow-lg'
                                    }`}
                                    title={isPreviewing ? 'Stop preview' : 'Preview'}
                                >
                                    {isPreviewing
                                        ? <Pause className="w-4 h-4 fill-current" />
                                        : <Play className="w-4 h-4 fill-current" />}
                                </button>
 
                                {/* Explicit select button */}
                                <button
                                    onClick={() => handleSelect(track)}
                                    className={`h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex-shrink-0 transition-all ${
                                        isSelected
                                            ? 'bg-primary-stitch text-white shadow-lg'
                                            : 'bg-white border border-outline-variant-stitch/30 text-primary-stitch hover:bg-surface-container-low-stitch'
                                    }`}
                                >
                                    {isSelected ? (
                                        <><Check className="w-3.5 h-3.5 mr-1" />ACTIVE</>
                                    ) : (
                                        'SELECT'
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Custom upload */}
            <div>
                <p className="text-[10px] font-black text-on-tertiary-container-stitch uppercase tracking-[0.2em] mb-3 px-1">📁 EXTERNAL SOUNDTRACK</p>
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-4 p-10 rounded-[32px] border-2 border-dashed transition-all duration-500 cursor-pointer ${
                        isUploading
                            ? 'border-tertiary-stitch bg-tertiary-stitch/5 cursor-wait'
                            : 'border-outline-variant-stitch/40 hover:border-primary-stitch hover:bg-surface-container-low-stitch hover:shadow-glow-stitch'
                    }`}
                >
                    {isUploading ? (
                        <><Loader2 className="w-8 h-8 text-tertiary-stitch animate-spin" /><p className="text-[10px] font-black uppercase tracking-widest text-primary-stitch">PROVISIONING...</p></>
                    ) : (
                        <>
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-glow-stitch flex items-center justify-center mb-1">
                                <Upload className="w-7 h-7 text-primary-stitch" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-stitch">Uplink Custom MP3</p>
                                <p className="text-[10px] text-secondary-stitch/60 font-medium italic">MAX 10MB · HIGH FIDELITY RECOMMENDED</p>
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

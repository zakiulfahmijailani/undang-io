"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Upload, Loader2, Play, Pause, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEDDING_MUSIC, WeddingTrack } from "@/data/weddingMusic";

interface MusicPickerTabProps {
    invitationId: string;
    currentMusicUrl: string;
    onChange: (url: string) => void;
}

export default function MusicPickerTab({ invitationId, currentMusicUrl, onChange }: MusicPickerTabProps) {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedName, setUploadedName] = useState<string>('');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Determine if current URL is a custom upload (not in curated list)
    const isCustom = currentMusicUrl && !WEDDING_MUSIC.find(t => t.url === currentMusicUrl);

    const handlePlay = (track: WeddingTrack) => {
        if (playingId === track.id) {
            // Pause
            audioRef.current?.pause();
            setPlayingId(null);
            return;
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = track.url;
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current = new Audio(track.url);
            audioRef.current.play().catch(() => {});
        }
        audioRef.current!.onended = () => setPlayingId(null);
        setPlayingId(track.id);
    };

    const handleSelect = (track: WeddingTrack) => {
        // Stop preview if playing
        if (playingId) {
            audioRef.current?.pause();
            setPlayingId(null);
        }
        onChange(track.url);
    };

    const handleClearCustom = () => {
        setUploadedName('');
        onChange('');
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) {
            alert('Ukuran file maksimal 8MB');
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

    // Cleanup audio on unmount
    useEffect(() => {
        return () => { audioRef.current?.pause(); };
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div>
                <h2 className="text-xl font-serif font-bold text-stone-800">Musik Latar</h2>
                <p className="text-sm text-stone-500 mt-1">
                    Pilih lagu dari koleksi kami atau upload MP3 sendiri. Musik akan diputar saat tamu membuka undangan.
                </p>
            </div>

            {/* Status: musik aktif */}
            {currentMusicUrl && (
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="flex-1 truncate">
                        {isCustom
                            ? `Custom: ${uploadedName || 'File di-upload'}`
                            : `Terpilih: ${WEDDING_MUSIC.find(t => t.url === currentMusicUrl)?.title || 'Lagu pilihan'}`}
                    </span>
                    <button
                        onClick={handleClearCustom}
                        className="text-emerald-600 hover:text-red-500 transition-colors flex-shrink-0"
                        title="Hapus musik"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Curated list */}
            <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">🎵 Koleksi Musik Wedding</p>
                <div className="grid grid-cols-1 gap-2">
                    {WEDDING_MUSIC.map((track) => {
                        const isSelected = currentMusicUrl === track.url;
                        const isPlaying = playingId === track.id;
                        return (
                            <div
                                key={track.id}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                                    isSelected
                                        ? 'bg-amber-50 border-amber-300 shadow-sm'
                                        : 'bg-white border-stone-200 hover:border-amber-200 hover:bg-amber-50/30'
                                }`}
                                onClick={() => handleSelect(track)}
                            >
                                {/* Emoji cover */}
                                <span className="text-2xl w-10 h-10 flex items-center justify-center bg-stone-100 rounded-lg flex-shrink-0">
                                    {track.coverEmoji}
                                </span>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-stone-800 truncate">{track.title}</p>
                                    <p className="text-xs text-stone-400">{track.genre} · {track.duration}</p>
                                </div>

                                {/* Preview button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePlay(track); }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                                        isPlaying
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-stone-100 text-stone-500 hover:bg-amber-100 hover:text-amber-600'
                                    }`}
                                    title={isPlaying ? 'Pause' : 'Preview'}
                                >
                                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                </button>

                                {/* Selected check */}
                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Custom upload */}
            <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">📁 Upload Musik Sendiri</p>
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
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
                            <p className="text-xs text-stone-400">Format MP3, maks. 8MB</p>
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
                    onClick={handleClearCustom}
                    className="w-full text-sm text-stone-400 hover:text-red-500 transition-colors py-2"
                >
                    Hapus musik (tanpa musik latar)
                </button>
            )}
        </div>
    );
}

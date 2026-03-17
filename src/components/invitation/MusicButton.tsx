"use client";

import { Volume2, VolumeX } from "lucide-react";

interface MusicButtonProps {
    isPlaying: boolean;
    onToggle: () => void;
}

const MusicButton = ({ isPlaying, onToggle }: MusicButtonProps) => (
    <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 flex items-center justify-center shadow-lg transition-all hover:scale-105 skeu-raised"
        title={isPlaying ? "Matikan Musik" : "Putar Musik"}
    >
        {isPlaying
            ? <Volume2 className="w-5 h-5 text-wedding-gold" />
            : <VolumeX className="w-5 h-5 text-stone-400" />}
    </button>
);

export default MusicButton;

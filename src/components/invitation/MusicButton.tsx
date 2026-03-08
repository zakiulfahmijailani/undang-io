"use client";

import { Music, VolumeX } from "lucide-react";

interface MusicButtonProps {
    isPlaying: boolean;
    onToggle: () => void;
}

const MusicButton = ({ isPlaying, onToggle }: MusicButtonProps) => {
    return (
        <button
            onClick={onToggle}
            className="fixed bottom-16 right-4 z-40 w-12 h-12 rounded-full bg-accent/90 text-accent-foreground shadow-lg flex items-center justify-center hover:bg-accent transition-colors backdrop-blur-sm cursor-pointer"
            title={isPlaying ? "Pause musik" : "Putar musik"}
        >
            {isPlaying ? (
                <Music className="w-5 h-5 animate-pulse-soft" />
            ) : (
                <VolumeX className="w-5 h-5" />
            )}
        </button>
    );
};

export default MusicButton;

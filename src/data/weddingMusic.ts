// Curated wedding music — royalty-free
// Source: Bensound (CORS open, royalty-free for non-commercial use with attribution)
// License: https://www.bensound.com/licensing
export interface WeddingTrack {
    id: string;
    title: string;
    artist: string;
    genre: string;
    duration: string;
    url: string;
    coverEmoji: string;
}

export const WEDDING_MUSIC: WeddingTrack[] = [
    {
        id: 'romantic',
        title: 'Romantic',
        artist: 'Bensound',
        genre: 'Piano · Romantic',
        duration: '3:32',
        url: 'https://www.bensound.com/bensound-music/bensound-romantic.mp3',
        coverEmoji: '🌹',
    },
    {
        id: 'tenderness',
        title: 'Tenderness',
        artist: 'Bensound',
        genre: 'Orkestra · Emotional',
        duration: '3:52',
        url: 'https://www.bensound.com/bensound-music/bensound-tenderness.mp3',
        coverEmoji: '✨',
    },
    {
        id: 'love',
        title: 'Love',
        artist: 'Bensound',
        genre: 'Ambient · Warm',
        duration: '3:52',
        url: 'https://www.bensound.com/bensound-music/bensound-love.mp3',
        coverEmoji: '❤️',
    },
    {
        id: 'memories',
        title: 'Memories',
        artist: 'Bensound',
        genre: 'Piano · Nostalgic',
        duration: '2:49',
        url: 'https://www.bensound.com/bensound-music/bensound-memories.mp3',
        coverEmoji: '🌸',
    },
    {
        id: 'cute',
        title: 'Cute',
        artist: 'Bensound',
        genre: 'Acoustic · Playful',
        duration: '2:42',
        url: 'https://www.bensound.com/bensound-music/bensound-cute.mp3',
        coverEmoji: '🌼',
    },
    {
        id: 'sunny',
        title: 'Sunny',
        artist: 'Bensound',
        genre: 'Acoustic · Uplifting',
        duration: '2:20',
        url: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
        coverEmoji: '☀️',
    },
    {
        id: 'sweet',
        title: 'Sweet',
        artist: 'Bensound',
        genre: 'Piano · Sweet',
        duration: '3:15',
        url: 'https://www.bensound.com/bensound-music/bensound-sweet.mp3',
        coverEmoji: '🍬',
    },
    {
        id: 'slowmotion',
        title: 'Slow Motion',
        artist: 'Bensound',
        genre: 'Cinematic · Dreamy',
        duration: '3:26',
        url: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3',
        coverEmoji: '🌙',
    },
    {
        id: 'betterdays',
        title: 'Better Days',
        artist: 'Bensound',
        genre: 'Acoustic · Hopeful',
        duration: '3:52',
        url: 'https://www.bensound.com/bensound-music/bensound-betterdays.mp3',
        coverEmoji: '🌅',
    },
    {
        id: 'onceagain',
        title: 'Once Again',
        artist: 'Bensound',
        genre: 'Piano · Emotional',
        duration: '3:40',
        url: 'https://www.bensound.com/bensound-music/bensound-onceagain.mp3',
        coverEmoji: '💫',
    },
];

// Max recommended upload for custom music
// ~3 min MP3 @ 128kbps ≈ 2.8MB → cap at 3 min / 4MB for fast loading
export const MUSIC_UPLOAD_LIMITS = {
    maxSizeMB: 4,
    maxSizeBytes: 4 * 1024 * 1024,
    recommendedDurationMin: 3,
    maxDurationMin: 4,
};

// Curated wedding music — royalty-free
// Source: SoundHelix (CC0 / public domain, CORS open, no CDN restriction)
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
        id: 'song-1',
        title: 'Romantic Waltz',
        artist: 'SoundHelix',
        genre: 'Orkestra · Romantic',
        duration: '~3 min',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverEmoji: '🎻',
    },
    {
        id: 'song-2',
        title: 'Gentle Serenade',
        artist: 'SoundHelix',
        genre: 'Instrumental · Calm',
        duration: '~3 min',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverEmoji: '🎹',
    },
    {
        id: 'song-3',
        title: 'Dreamy Strings',
        artist: 'SoundHelix',
        genre: 'Ambient · Dreamy',
        duration: '~3 min',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverEmoji: '✨',
    },
    {
        id: 'song-4',
        title: 'Sweet Moment',
        artist: 'SoundHelix',
        genre: 'Akustik · Warm',
        duration: '~3 min',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverEmoji: '🌸',
    },
    {
        id: 'song-5',
        title: 'Cinematic Love',
        artist: 'SoundHelix',
        genre: 'Cinematic · Emotional',
        duration: '~3 min',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverEmoji: '🎬',
    },
    {
        id: 'song-6',
        title: 'Morning Bliss',
        artist: 'SoundHelix',
        genre: 'Uplifting · Hopeful',
        duration: '~3 min',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        coverEmoji: '☀️',
    },
    {
        id: 'song-7',
        title: 'Eternal Together',
        artist: 'SoundHelix',
        genre: 'Piano · Reflective',
        duration: '~3 min',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        coverEmoji: '🎹',
    },
    {
        id: 'song-8',
        title: 'Folk Wedding',
        artist: 'SoundHelix',
        genre: 'Folk · Acoustic',
        duration: '~3 min',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        coverEmoji: '🎸',
    },
    {
        id: 'song-9',
        title: 'Midnight Promise',
        artist: 'SoundHelix',
        genre: 'Lo-fi · Chill',
        duration: '~3 min',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        coverEmoji: '🌃',
    },
    {
        id: 'song-10',
        title: 'Joyful Day',
        artist: 'SoundHelix',
        genre: 'Upbeat · Festive',
        duration: '~3 min',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
        coverEmoji: '🎉',
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

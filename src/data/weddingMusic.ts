// Curated wedding music — royalty-free
// Source: Mixkit (royalty-free, no attribution required)
// License: https://mixkit.co/license/#musicFree
// Hosted: Supabase Storage bucket 'music'
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
        id: 'mixkit-if-i-could-then-i-would-1099',
        title: 'If I Could Then I Would',
        artist: 'Mixkit',
        genre: 'Acoustic · Romantic',
        duration: '~3 min',
        url: 'https://zbhjomuenjacoepwpiyw.supabase.co/storage/v1/object/public/music/mixkit-if-i-could-then-i-would-1099.mp3',
        coverEmoji: '🌹',
    },
    {
        id: 'mixkit-old-letter-854',
        title: 'Old Letter',
        artist: 'Mixkit',
        genre: 'Piano · Nostalgic',
        duration: '~3 min',
        url: 'https://zbhjomuenjacoepwpiyw.supabase.co/storage/v1/object/public/music/mixkit-old-letter-854.mp3',
        coverEmoji: '✉️',
    },
    {
        id: 'mixkit-possible-dreams-599',
        title: 'Possible Dreams',
        artist: 'Mixkit',
        genre: 'Cinematic · Dreamy',
        duration: '~3 min',
        url: 'https://zbhjomuenjacoepwpiyw.supabase.co/storage/v1/object/public/music/mixkit-possible-dreams-599.mp3',
        coverEmoji: '✨',
    },
    {
        id: 'mixkit-true-love-43',
        title: 'True Love',
        artist: 'Mixkit',
        genre: 'Piano · Romantic',
        duration: '~3 min',
        url: 'https://zbhjomuenjacoepwpiyw.supabase.co/storage/v1/object/public/music/mixkit-true-love-43.mp3',
        coverEmoji: '❤️',
    },
    {
        id: 'mixkit-wedding-01-657',
        title: 'Wedding',
        artist: 'Mixkit',
        genre: 'Orkestra · Ceremonial',
        duration: '~3 min',
        url: 'https://zbhjomuenjacoepwpiyw.supabase.co/storage/v1/object/public/music/mixkit-wedding-01-657.mp3',
        coverEmoji: '💒',
    },
    {
        id: 'mixkit-wedding-harp-672',
        title: 'Wedding Harp',
        artist: 'Mixkit',
        genre: 'Harp · Elegant',
        duration: '~3 min',
        url: 'https://zbhjomuenjacoepwpiyw.supabase.co/storage/v1/object/public/music/mixkit-wedding-harp-672.mp3',
        coverEmoji: '🎶',
    },
    {
        id: 'mixkit-wedding-song-323',
        title: 'Wedding Song',
        artist: 'Mixkit',
        genre: 'Acoustic · Warm',
        duration: '~3 min',
        url: 'https://zbhjomuenjacoepwpiyw.supabase.co/storage/v1/object/public/music/mixkit-wedding-song-323.mp3',
        coverEmoji: '🌸',
    },
    {
        id: 'mixkit-well-be-okay-1081',
        title: "We'll Be Okay",
        artist: 'Mixkit',
        genre: 'Acoustic · Hopeful',
        duration: '~3 min',
        url: 'https://zbhjomuenjacoepwpiyw.supabase.co/storage/v1/object/public/music/mixkit-well-be-okay-1081.mp3',
        coverEmoji: '🌅',
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

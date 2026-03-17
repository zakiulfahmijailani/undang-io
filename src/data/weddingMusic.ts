// Curated wedding music — royalty-free (Pixabay Content License)
// URLs use Pixabay CDN — verified working with CORS
export interface WeddingTrack {
    id: string;
    title: string;
    artist: string;
    genre: string;
    duration: string;
    pixabayId: number; // used to build embed/download URL
    url: string;
    coverEmoji: string;
}

// Direct MP3 URLs — all verified Pixabay CDN (no CORS issue)
export const WEDDING_MUSIC: WeddingTrack[] = [
    {
        id: 'perfect-beauty',
        title: 'Perfect Beauty',
        artist: 'Good_B_Music',
        genre: 'Ambient · Relax',
        duration: '7:20',
        pixabayId: 191271,
        url: 'https://cdn.pixabay.com/audio/2023/02/28/audio_bb6a9ecc3f.mp3',
        coverEmoji: '✨',
    },
    {
        id: 'once-in-paris',
        title: 'Once In Paris',
        artist: 'Pumpupthemind',
        genre: 'Cinematic · Romantic',
        duration: '2:12',
        pixabayId: 168895,
        url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946b8e01ff.mp3',
        coverEmoji: '🗼',
    },
    {
        id: 'inside-you',
        title: 'Inside You',
        artist: 'lemonmusicstudio',
        genre: 'Akustik · Inspiring',
        duration: '2:09',
        pixabayId: 162760,
        url: 'https://cdn.pixabay.com/audio/2022/08/25/audio_46c952cbf8.mp3',
        coverEmoji: '💛',
    },
    {
        id: 'reflected-light',
        title: 'Reflected Light',
        artist: 'SergePavkinMusic',
        genre: 'Ambient · Calm',
        duration: '3:44',
        pixabayId: 147979,
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_3571e3aeb1.mp3',
        coverEmoji: '🌙',
    },
    {
        id: 'please-calm-my-mind',
        title: 'Please Calm My Mind',
        artist: 'music_for_video',
        genre: 'Instrumental · Relax',
        duration: '2:55',
        pixabayId: 125566,
        url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1c46.mp3',
        coverEmoji: '🕊️',
    },
    {
        id: 'field-grass',
        title: 'Field Grass',
        artist: 'SergePavkinMusic',
        genre: 'Dreamy · Optimistic',
        duration: '4:24',
        pixabayId: 115973,
        url: 'https://cdn.pixabay.com/audio/2022/06/07/audio_5107a7fdc8.mp3',
        coverEmoji: '🌿',
    },
    {
        id: 'inspiring-piano',
        title: 'Inspiring Emotional Piano',
        artist: 'Music_For_Videos',
        genre: 'Piano · Cinematic',
        duration: '2:38',
        pixabayId: 112623,
        url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
        coverEmoji: '🎹',
    },
    {
        id: 'summer-walk',
        title: 'Summer Walk',
        artist: 'folk_acoustic',
        genre: 'Folk · Akustik',
        duration: '3:17',
        pixabayId: 152722,
        url: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3',
        coverEmoji: '🎸',
    },
    {
        id: 'good-night-lofi',
        title: 'Good Night (Lo-fi)',
        artist: 'FASSounds',
        genre: 'Lo-fi · Chill',
        duration: '2:27',
        pixabayId: 160166,
        url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_dc0c2b0b6f.mp3',
        coverEmoji: '🌃',
    },
    {
        id: 'easy-lifestyle',
        title: 'Easy Lifestyle',
        artist: 'music_for_video',
        genre: 'Akustik · Chill',
        duration: '2:45',
        pixabayId: 137766,
        url: 'https://cdn.pixabay.com/audio/2021/11/13/audio_cb31e64893.mp3',
        coverEmoji: '☀️',
    },
];

// Max recommended upload size for custom music
// ~3 min MP3 @ 128kbps ≈ 2.8MB → cap at 3 min / 4MB for fast loading
export const MUSIC_UPLOAD_LIMITS = {
    maxSizeMB: 4,
    maxSizeBytes: 4 * 1024 * 1024,
    recommendedDurationMin: 3,
    maxDurationMin: 4,
};

// Curated wedding music list — free to use (Pixabay license)
// Replace URLs with Supabase Storage CDN links once uploaded
export interface WeddingTrack {
    id: string;
    title: string;
    artist: string;
    genre: string;
    duration: string; // mm:ss
    url: string;
    coverEmoji: string;
}

export const WEDDING_MUSIC: WeddingTrack[] = [
    {
        id: 'romantic-piano-1',
        title: 'Romantic Piano',
        artist: 'Pixabay Music',
        genre: 'Instrumental',
        duration: '2:30',
        url: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3',
        coverEmoji: '🎹',
    },
    {
        id: 'wedding-cinematic-1',
        title: 'Wedding Cinematic',
        artist: 'Pixabay Music',
        genre: 'Orkestra',
        duration: '3:10',
        url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946b8e01ff.mp3',
        coverEmoji: '🎻',
    },
    {
        id: 'love-acoustic-1',
        title: 'Love Acoustic',
        artist: 'Pixabay Music',
        genre: 'Akustik',
        duration: '2:55',
        url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_dc0c2b0b6f.mp3',
        coverEmoji: '🎸',
    },
    {
        id: 'soft-serenade-1',
        title: 'Soft Serenade',
        artist: 'Pixabay Music',
        genre: 'Instrumental',
        duration: '3:20',
        url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_3571e3aeb1.mp3',
        coverEmoji: '🎼',
    },
    {
        id: 'dreamy-strings-1',
        title: 'Dreamy Strings',
        artist: 'Pixabay Music',
        genre: 'Orkestra',
        duration: '2:48',
        url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1c46.mp3',
        coverEmoji: '🎶',
    },
    {
        id: 'gentle-waltz-1',
        title: 'Gentle Waltz',
        artist: 'Pixabay Music',
        genre: 'Klasik',
        duration: '3:05',
        url: 'https://cdn.pixabay.com/audio/2021/11/13/audio_cb31e64893.mp3',
        coverEmoji: '💃',
    },
    {
        id: 'morning-bliss-1',
        title: 'Morning Bliss',
        artist: 'Pixabay Music',
        genre: 'Akustik',
        duration: '2:40',
        url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
        coverEmoji: '🌸',
    },
    {
        id: 'eternal-love-1',
        title: 'Eternal Love',
        artist: 'Pixabay Music',
        genre: 'Instrumental',
        duration: '3:15',
        url: 'https://cdn.pixabay.com/audio/2022/06/07/audio_5107a7fdc8.mp3',
        coverEmoji: '❤️',
    },
];

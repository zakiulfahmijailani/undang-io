export type QuoteItem = {
    id: string;
    religion: string;
    source: string;
    text: string;
};

export const PREDEFINED_QUOTES: QuoteItem[] = [
    // ISLAM
    {
        id: "islam-1",
        religion: "Islam",
        source: "QS. Ar-Rum: 21",
        text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."
    },
    {
        id: "islam-2",
        religion: "Islam",
        source: "QS. Az-Zariyat: 49",
        text: "Dan segala sesuatu Kami ciptakan berpasang-pasangan supaya kamu mengingat kebesaran Allah."
    },
    {
        id: "islam-3",
        religion: "Islam",
        source: "QS. An-Nur: 32",
        text: "Dan kawinkanlah orang-orang yang sendirian di antara kamu, dan orang-orang yang layak (berkawin) dari hamba-hamba sahayamu yang lelaki dan hamba-hamba sahayamu yang perempuan. Jika mereka miskin Allah akan memampukan mereka dengan kurnia-Nya."
    },
    // KRISTEN PROTESTAN
    {
        id: "kristen-1",
        religion: "Kristen Protestan",
        source: "1 Korintus 13:4-7",
        text: "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri."
    },
    {
        id: "kristen-2",
        religion: "Kristen Protestan",
        source: "Matius 19:6",
        text: "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia."
    },
    {
        id: "kristen-3",
        religion: "Kristen Protestan",
        source: "Pengkhotbah 4:12",
        text: "Dan bilamana seorang dapat dialahkan, dua orang akan dapat bertahan. Tali tiga lembar tidak mudah diputuskan."
    },
    // KATOLIK
    {
        id: "katolik-1",
        religion: "Katolik",
        source: "Kejadian 2:24",
        text: "Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan isterinya, sehingga keduanya menjadi satu daging."
    },
    {
        id: "katolik-2",
        religion: "Katolik",
        source: "Tobit 8:7",
        text: "Bukan karena dorongan hawa nafsu aku mengambil saudariku ini, melainkan dengan hati yang tulus. Sudilah Engkau mengasihani aku dan dia, dan memperkenankan kami menjadi tua bersama-sama."
    },
    {
        id: "katolik-3",
        religion: "Katolik",
        source: "1 Yohanes 4:12",
        text: "Tidak ada seorangpun yang pernah melihat Allah. Jika kita saling mengasihi, Allah tetap di dalam kita, dan kasih-Nya sempurna di dalam kita."
    },
    // HINDU
    {
        id: "hindu-1",
        religion: "Hindu",
        source: "Rgveda X.85.42",
        text: "Semoga kamu berdua tinggal di sini, semoga kamu tidak pernah berpisah. Semoga kamu mencapai usia penuh, bahagia bermain dengan anak-anak dan cucu-cucu di rumahmu sendiri."
    },
    {
        id: "hindu-2",
        religion: "Hindu",
        source: "Atharvaveda XIV.1.50",
        text: "Semoga Brahman, dewa-dewa yang lainnya dan manusia bersama-sama mempersatukan hati kita. Semoga kita berdua memiliki pemikiran dan tujuan yang sama."
    },
    // BUDDHA
    {
        id: "buddha-1",
        religion: "Buddha",
        source: "Sigalovada Sutta",
        text: "Dalam lima cara seorang suami melayani istrinya: dengan menghormatinya, dengan bersikap sopan, dengan setia, dengan menyerahkan kekuasaan, dan dengan memberinya perhiasan. Dalam lima cara istri melayani suaminya: tugas diatur dengan baik, ramah kepada keluarga, setia, menjaga kekayaan, dan rajin dalam semua tugas."
    },
    {
        id: "buddha-2",
        religion: "Buddha",
        source: "Dhammapada 302",
        text: "Kegembiraan ada pada keluarga yang damai dan bersatu. Berbahagialah mereka yang dapat mengendalikan diri dan saling menghormati."
    },
    // KONGHUCU
    {
        id: "konghucu-1",
        religion: "Konghucu",
        source: "Mengzi IV A: 28",
        text: "Cinta kasih (Ren) adalah rumah yang paling damai; Kebenaran (Yi) adalah jalan yang paling benar. Teruslah berjalan bersama dalam harmoni."
    },
    {
        id: "konghucu-2",
        religion: "Konghucu",
        source: "Liji XLIII: 7",
        text: "Pernikahan adalah penyatuan kasih sayang antara dua keluarga yang berbeda nama. Di atas untuk melayani leluhur, di bawah untuk meneruskan keturunan."
    }
];

import Image from "next/image"

export default function HeroSection() {
    return (
        <section className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://picsum.photos/id/1015/800/1200"
                    alt="Wedding Couple"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center text-white px-6 w-full max-w-lg mx-auto">
                <span className="uppercase tracking-[0.3em] text-xs md:text-sm text-yellow-500 mb-6 font-semibold">
                    The Wedding Of
                </span>

                <h1 className="font-serif text-5xl md:text-7xl mb-4 leading-tight text-white drop-shadow-lg">
                    Andi<br />
                    <span className="text-4xl md:text-5xl text-yellow-500 font-light">&amp;</span><br />
                    Rina
                </h1>

                <p className="text-lg md:text-xl font-light tracking-wide mt-4 mb-10 text-gray-200">
                    Sabtu, 15 Agustus 2026
                </p>

                {/* Countdown */}
                <div className="flex gap-4 md:gap-6 justify-center w-full">
                    <div className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <span className="text-2xl md:text-3xl font-serif font-bold text-white">45</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-300">Hari</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <span className="text-2xl md:text-3xl font-serif font-bold text-white">12</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-300">Jam</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <span className="text-2xl md:text-3xl font-serif font-bold text-white">30</span>
                        <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-300">Menit</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

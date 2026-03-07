export default function RSVPSection() {
    return (
        <section className="py-20 px-6 bg-[#14213D] text-white text-center">
            <div className="max-w-md mx-auto">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Konfirmasi Kehadiran</h2>
                <p className="text-gray-300 mb-10 text-sm font-light">
                    Merupakan suatu kehormatan bagi kami jika Anda dapat hadir untuk memberikan restu secara langsung.
                </p>

                <form className="flex flex-col gap-4 text-left">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">Nama Lengkap</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            placeholder="Contoh: Budi Santoso"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">Apakah Anda Akan Hadir?</label>
                        <select className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 appearance-none transition-all">
                            <option value="ya" className="text-gray-800">Ya, Saya Akan Hadir</option>
                            <option value="tidak" className="text-gray-800">Maaf, Tidak Bisa Hadir</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">Jumlah Tamu</label>
                        <select className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 appearance-none transition-all">
                            <option value="1" className="text-gray-800">1 Orang</option>
                            <option value="2" className="text-gray-800">2 Orang</option>
                        </select>
                    </div>

                    <button type="button" className="w-full py-4 bg-yellow-500 text-[#14213D] text-sm font-bold rounded-xl shadow-lg hover:bg-yellow-400 transition-colors mt-6 uppercase tracking-wider">
                        Kirim Konfirmasi
                    </button>
                </form>
            </div>
        </section>
    )
}

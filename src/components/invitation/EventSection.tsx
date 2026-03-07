import { Calendar, MapPin, Clock } from "lucide-react"

export default function EventSection() {
    return (
        <section className="py-20 px-6 bg-[#FAF9F6] text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#14213D] mb-12">Detail Acara</h2>

            <div className="flex flex-col gap-8 max-w-sm mx-auto">
                {/* Akad Nikah */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
                        <Calendar className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#14213D] mb-4">Akad Nikah</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                        <Clock className="w-4 h-4" /> 08:00 WIB - Selesai
                    </div>
                    <p className="text-sm text-gray-500 mb-6 flex flex-col items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Masjid Agung Sunda Kelapa
                        <span className="text-xs text-gray-400 mt-1">Menteng, Jakarta Pusat</span>
                    </p>
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="w-full py-3 bg-[#14213D] text-white text-sm font-medium rounded-full shadow-md hover:bg-[#1a2b50] transition-colors border border-transparent">
                        Buka Google Maps
                    </a>
                </div>

                {/* Resepsi */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
                        <Calendar className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#14213D] mb-4">Resepsi</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                        <Clock className="w-4 h-4" /> 11:00 WIB - 14:00 WIB
                    </div>
                    <p className="text-sm text-gray-500 mb-6 flex flex-col items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Hotel Mulia Senayan
                        <span className="text-xs text-gray-400 mt-1">Gelora, Jakarta Pusat</span>
                    </p>
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="w-full py-3 bg-[#14213D] text-white text-sm font-medium rounded-full shadow-md hover:bg-[#1a2b50] transition-colors border border-transparent">
                        Buka Google Maps
                    </a>
                </div>

                {/* Save to Calendar Button */}
                <button className="w-full py-3.5 bg-yellow-500 text-white text-sm font-bold rounded-full shadow-lg hover:bg-yellow-600 transition-colors mt-4 tracking-wide uppercase">
                    Simpan ke Kalender
                </button>
            </div>
        </section>
    )
}

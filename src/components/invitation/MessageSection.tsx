import { MessageSquare } from "lucide-react"

export default function MessageSection() {
    const messages = [
        { name: "Keluarga Besar Siregar", time: "2 jam yang lalu", text: "Selamat menempuh hidup baru Andi & Rina. Semoga Sakinah, Mawaddah, Warahmah." },
        { name: "Siska & Didi", time: "5 jam yang lalu", text: "Happy wedding kalian berdua! Maaf banget gabisa hadir soalnya lagi di luar kota. Semoga langgeng trus ya!!" },
        { name: "Pak RT 05", time: "1 hari yang lalu", text: "Selamat atas pernikahannya mas Andi, semoga lekas diberi momongan yang sholeh/sholehah." },
    ];

    return (
        <section className="py-20 px-6 bg-[#FAF9F6] text-center">
            <div className="max-w-xl mx-auto">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#14213D] mb-4">Ucapan & Doa</h2>
                <p className="text-gray-500 mb-10 text-sm">Tinggalkan pesan bahagia untuk kedua mempelai di hari spesial mereka.</p>

                {/* Form Ucapan */}
                <form className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 text-left mb-10">
                    <div>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] transition-all text-sm"
                            placeholder="Nama Anda"
                        />
                    </div>
                    <div>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] transition-all text-sm resize-none"
                            placeholder="Ucapkan sesuatu untuk mempelai..."
                        ></textarea>
                    </div>
                    <button type="button" className="w-full py-3 bg-[#14213D] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#1a2b50] transition-colors flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Kirim Ucapan
                    </button>
                </form>

                {/* Daftar Ucapan */}
                <div className="flex flex-col gap-4 text-left max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-2 mb-2">
                                <span className="font-bold text-[#14213D] text-sm">{msg.name}</span>
                                <span className="text-[10px] text-gray-400">{msg.time}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed italic">
                                "{msg.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

import { CreditCard, Wallet, Copy } from "lucide-react"

export default function DigitalGiftSection() {
    return (
        <section className="py-20 px-6 bg-white text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#14213D] mb-4">Kirim Hadiah Digital</h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto text-sm">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika Anda ingin memberikan tanda kasih berupa hadiah digital, Anda dapat melalui tautan di bawah ini.</p>

            <div className="flex flex-col gap-6 max-w-md mx-auto">
                {/* QRIS Placeholder */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center">
                    <div className="w-16 h-8 bg-[#00569c] rounded flex items-center justify-center text-white font-bold italic tracking-wide mb-4">
                        QRIS
                    </div>
                    <div className="w-48 h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
                        <Wallet className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="font-bold text-[#14213D]">A.N. Andi & Rina</p>
                    <p className="text-xs text-gray-500 mt-1">Gunakan aplikasi e-Wallet atau Mobile Banking Anda</p>
                </div>

                {/* Bank Transfer Request Placeholder */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#14213D] mb-4">Transfer Bank</h3>

                    <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-left mb-3">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bank BCA</span>
                        <div className="flex items-center justify-between mt-1">
                            <span className="font-mono text-lg font-medium tracking-widest text-[#14213D]">123 456 7890</span>
                            <button className="text-blue-600 p-1.5 hover:bg-blue-50 rounded-md transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        <span className="text-sm text-gray-600 mt-2 block">A.N. Andi Wijaya</span>
                    </div>

                    <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bank Mandiri</span>
                        <div className="flex items-center justify-between mt-1">
                            <span className="font-mono text-lg font-medium tracking-widest text-[#14213D]">098 765 4321</span>
                            <button className="text-blue-600 p-1.5 hover:bg-blue-50 rounded-md transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        <span className="text-sm text-gray-600 mt-2 block">A.N. Rina Sulistyowati</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

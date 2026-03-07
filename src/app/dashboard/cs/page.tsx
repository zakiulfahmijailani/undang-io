import { Mail, Clock } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

export default function CustomerServicePage() {
    return (
        <div className="flex flex-col gap-6 max-w-[1000px] mx-auto pb-10 mt-4">
            {/* Header Card */}
            <div className="bg-white rounded-[2rem] p-8 text-center shadow-[0px_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100">
                <h2 className="text-2xl font-bold text-[#14213D] mb-2">Hubungi Kami</h2>
                <p className="text-neutral-500 text-sm">
                    Segera konsultasikan kepada kami kebutuhan anda. Tim kami akan membantu anda.
                </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                    href="https://wa.me/6282119955112"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-3 text-[#25D366] group-hover:scale-105 transition-transform">
                        <FaWhatsapp className="w-6 h-6" />
                        <span className="text-lg font-semibold text-[#14213D]">WhatsApp</span>
                    </div>
                    <p className="text-[#9E1045] font-medium">+62 8211 9955 112</p>
                </a>

                <a
                    href="mailto:admin@wevitation.com"
                    className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-3 text-[#20b486] group-hover:scale-105 transition-transform">
                        <Mail className="w-6 h-6" strokeWidth={2.5} />
                        <span className="text-lg font-semibold text-[#14213D]">Email</span>
                    </div>
                    <p className="text-[#9E1045] font-medium">admin@wevitation.com</p>
                </a>
            </div>

            {/* Operational Hours */}
            <div className="bg-white rounded-[2rem] p-8 mt-2 flex flex-col items-center justify-center gap-3 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100">
                <div className="flex items-center gap-3 text-[#20b486]">
                    <Clock className="w-5 h-5" />
                    <span className="text-lg font-semibold text-[#14213D]">Jam Operasional Layanan Customer Service</span>
                </div>
                <div className="text-center font-medium mt-1">
                    <p className="text-[#9E1045] mb-1">Setiap Hari</p>
                    <p className="text-[#9E1045]">08.00 - 20.00 WIB</p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between text-xs text-neutral-400 mt-12 pt-8 border-t border-neutral-200">
                <p>Made with ❤️ for your Moment | Powered by Wevitation</p>
                <p className="mt-2 md:mt-0">Version: 1.2</p>
            </div>
        </div>
    )
}

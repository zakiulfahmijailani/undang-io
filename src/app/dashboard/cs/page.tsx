import { Mail, Clock } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

export default function CustomerServicePage() {
    return (
        <div className="flex flex-col gap-6 max-w-[1000px] mx-auto pb-10 mt-4">
            {/* Header Card */}
            <div className="bg-card rounded-[2rem] p-8 text-center shadow-sm border border-border">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Hubungi Kami</h2>
                <p className="text-muted-foreground text-sm">
                    Segera konsultasikan kepada kami kebutuhan anda. Tim kami akan membantu anda.
                </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                    href="https://wa.me/6282119955112"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-card rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 shadow-sm border border-border hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-3 text-[#25D366] group-hover:scale-105 transition-transform">
                        <FaWhatsapp className="w-6 h-6" />
                        <span className="text-lg font-semibold text-foreground">WhatsApp</span>
                    </div>
                    <p className="text-primary font-medium">+62 821 1995 5112</p>
                </a>

                <a
                    href="mailto:admin@undang.io"
                    className="bg-card rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 shadow-sm border border-border hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-3 text-accent group-hover:scale-105 transition-transform">
                        <Mail className="w-6 h-6" strokeWidth={2.5} />
                        <span className="text-lg font-semibold text-foreground">Email</span>
                    </div>
                    <p className="text-primary font-medium">admin@undang.io</p>
                </a>
            </div>

            {/* Operational Hours */}
            <div className="bg-card rounded-[2rem] p-8 mt-2 flex flex-col items-center justify-center gap-3 shadow-sm border border-border">
                <div className="flex items-center gap-3 text-accent">
                    <Clock className="w-5 h-5" />
                    <span className="text-lg font-semibold text-foreground">Jam Operasional Layanan Customer Service</span>
                </div>
                <div className="text-center font-medium mt-1">
                    <p className="text-primary mb-1">Setiap Hari</p>
                    <p className="text-primary">08.00 - 20.00 WIB</p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground mt-12 pt-8 border-t border-border">
                <p>Made with ❤️ for your Moment | Powered by undang.io</p>
                <p className="mt-2 md:mt-0">Version: 1.2</p>
            </div>
        </div>
    )
}

import { Button } from "@/components/ui/button"
import { Construction, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WizardPlaceholderPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-[#FCA311]/20 text-[#14213D] rounded-full flex items-center justify-center mb-8 shadow-inner">
                <Construction className="w-12 h-12 text-[#b5730a]" />
            </div>

            <h1 className="text-4xl font-serif font-bold text-[#14213D] mb-4">
                Wizard Buat Undangan
            </h1>

            <p className="text-xl text-gray-500 mb-2">
                — Coming Soon —
            </p>

            <p className="text-gray-400 mb-10 max-w-md">
                Fitur wizard untuk mengatur data pasangan, acara, dan galeri secara bertahap sedang dalam tahap pengembangan.
            </p>

            <Link href="/dashboard/undangan/baru">
                <Button className="bg-[#14213D] hover:bg-[#1a2b50] text-white gap-2 px-8 h-12 text-lg rounded-full shadow-lg transition-transform hover:scale-105">
                    <ArrowLeft className="w-5 h-5" /> Kembali Pilih Tema
                </Button>
            </Link>
        </div>
    )
}

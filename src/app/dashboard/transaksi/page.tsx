import { CheckCircle2 } from "lucide-react"

export default function TransaksiPage() {
    const packages = [
        {
            title: "Premium",
            subtitle: "Cocok untuk pasangan individu",
            promo: "Promo Sampai 31 Maret 2026",
            originalPrice: "100.000",
            discount: "31% OFF",
            price: "69.000",
            features: [
                "Upgrade Undangan Premium",
                "Undangan Aktif Selamanya",
                "Unlimited Kuota Tamu",
                "Foto & Video Gallery",
                "Ucapan & Doa",
                "Tema Premium",
                "Link Streaming",
                "Kado Cashless / Donasi",
                "Layar Penerima Tamu",
            ],
            isPopular: false
        },
        {
            title: "Business",
            subtitle: "Cocok untuk pasangan bisnis kecil",
            promo: "Promo Sampai 31 Maret 2026",
            originalPrice: "200.000",
            discount: "50% OFF",
            price: "99.000",
            features: [
                "Upgrade Premium +1 Undangan",
                "Undangan Aktif Selamanya",
                "Unlimited Kuota Tamu",
                "Foto & Video Gallery",
                "Ucapan & Doa",
                "Tema Premium",
                "Link Streaming",
                "Kado Cashless / Donasi",
                "Layar Penerima Tamu",
            ],
            isPopular: false
        },
        {
            title: "Enterprise",
            subtitle: "Cocok untuk bisnis menengah",
            promo: "Promo Sampai 31 Maret 2026",
            originalPrice: "500.000",
            discount: "52% OFF",
            price: "240.000",
            features: [
                "Upgrade Premium +4 Undangan",
                "Undangan Aktif Selamanya",
                "Unlimited Kuota Tamu",
                "Foto & Video Gallery",
                "Ucapan & Doa",
                "Tema Premium",
                "Link Streaming",
                "Kado Cashless / Donasi",
                "Layar Penerima Tamu",
            ],
            isPopular: false
        }
    ]

    const partnerPackages = [
        {
            title: "Mitra - Silver",
            subtitle: "Cocok untuk bisnis besar",
            promo: "Promo Sampai 31 Maret 2026",
            originalPrice: "1.100.000",
            discount: "54% OFF",
            price: "500.000",
            features: [
                "Upgrade Premium +10 Undangan",
                "Undangan Aktif Selamanya",
                "Unlimited Kuota Tamu",
                "Foto & Video Gallery",
                "Ucapan & Doa",
                "Tema Premium",
                "Link Streaming",
                "Kado Cashless / Donasi",
                "Layar Penerima Tamu",
                "Branding Teks"
            ],
        },
        {
            title: "Mitra - Gold",
            subtitle: "Cocok untuk bisnis besar",
            promo: "Promo Sampai 31 Maret 2026",
            originalPrice: "2.300.000",
            discount: "56% OFF",
            price: "1.000.000",
            features: [
                "Upgrade Premium +22 Undangan",
                "Undangan Aktif Selamanya",
                "Unlimited Kuota Tamu",
                "Foto & Video Gallery",
                "Ucapan & Doa",
                "Tema Premium",
                "Link Streaming",
                "Kado Cashless / Donasi",
                "Layar Penerima Tamu",
                "Branding Teks",
                "Branding Logo"
            ],
        }
    ]

    return (
        <div className="flex flex-col gap-8 max-w-[1200px] mx-auto pb-10 mt-4">
            {/* Top 3 Packages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {packages.map((pkg, idx) => (
                    <div key={idx} className="bg-[#FCFCFC] rounded-[2rem] p-8 flex flex-col relative h-full shadow-[0px_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100 hover:shadow-lg transition-all duration-300">

                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-[#14213D] mb-2">{pkg.title}</h3>
                            <p className="text-sm text-neutral-500 mb-1">{pkg.subtitle}</p>
                            <p className="text-sm font-medium text-neutral-600 mb-6">{pkg.promo}</p>

                            <div className="flex items-center justify-center gap-2 mb-1">
                                <p className="text-xs text-neutral-400 line-through decoration-neutral-400">IDR {pkg.originalPrice}</p>
                                <span className="text-[10px] font-bold bg-[#9E1045] text-white px-2 py-0.5 rounded-md">{pkg.discount}</span>
                            </div>

                            <div className="flex items-center justify-center -ml-2">
                                <span className="text-xs font-bold text-[#9E1045] mt-2 mr-1">IDR</span>
                                <span className="text-5xl font-bold text-[#9E1045] tracking-tight">{pkg.price}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 flex-1">
                            {pkg.features.map((feature, fIdx) => (
                                <div key={fIdx} className="flex items-center justify-between">
                                    <span className="text-sm text-[#14213D] font-medium">{feature}</span>
                                    <div className="bg-[#e9faec] text-[#2ebd59] p-0.5 rounded-full shrink-0">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button className="bg-[#9E1045] hover:bg-[#8B1842] text-white text-sm font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                                Pilih Paket
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom 2 Mitra Packages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 lg:px-24">
                {partnerPackages.map((pkg, idx) => (
                    <div key={idx} className="bg-[#FCFCFC] rounded-[2rem] p-8 flex flex-col relative h-full shadow-[0px_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100 hover:shadow-lg transition-all duration-300">

                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-[#14213D] mb-2">{pkg.title}</h3>
                            <p className="text-sm text-neutral-500 mb-1">{pkg.subtitle}</p>
                            <p className="text-sm font-medium text-neutral-600 mb-6">{pkg.promo}</p>

                            <div className="flex items-center justify-center gap-2 mb-1">
                                <p className="text-xs text-neutral-400 line-through decoration-neutral-400">IDR {pkg.originalPrice}</p>
                                <span className="text-[10px] font-bold bg-[#9E1045] text-white px-2 py-0.5 rounded-md">{pkg.discount}</span>
                            </div>

                            <div className="flex items-center justify-center -ml-2">
                                <span className="text-xs font-bold text-[#9E1045] mt-2 mr-1">IDR</span>
                                <span className="text-5xl font-bold text-[#9E1045] tracking-tight">{pkg.price}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 flex-1">
                            {pkg.features.map((feature, fIdx) => (
                                <div key={fIdx} className="flex items-center justify-between">
                                    <span className="text-sm text-[#14213D] font-medium">{feature}</span>
                                    <div className="bg-[#e9faec] text-[#2ebd59] p-0.5 rounded-full shrink-0">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button className="bg-[#9E1045] hover:bg-[#8B1842] text-white text-sm font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                                Pilih Paket
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-10"></div>
        </div>
    )
}

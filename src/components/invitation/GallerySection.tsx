import Image from "next/image"

export default function GallerySection() {
    const images = [
        "https://picsum.photos/id/1018/400/500",
        "https://picsum.photos/id/1019/400/400",
        "https://picsum.photos/id/1020/400/600",
        "https://picsum.photos/id/1021/400/600",
        "https://picsum.photos/id/1022/400/400",
        "https://picsum.photos/id/1023/400/500",
    ]

    return (
        <section className="py-20 px-6 bg-white text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#14213D] mb-4">Galeri Momen</h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto text-sm">Berbagi kebahagiaan kami dalam setiap potret kenangan indah bersama.</p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
                {images.map((src, index) => (
                    <div key={index} className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                        <Image
                            src={src}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                ))}
            </div>
        </section>
    )
}

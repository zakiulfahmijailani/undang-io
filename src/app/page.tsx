import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles, MonitorSmartphone, Gift } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-body bg-[var(--color-surface-page)] text-[var(--color-neutral-900)]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 border-b border-[var(--color-neutral-200)] bg-white/80 backdrop-blur-md">
        <Link href="/" className="text-h3 font-display font-bold text-[var(--color-primary-600)]">
          NikahKu
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-body-md font-medium text-[var(--color-neutral-600)] hover:text-[var(--color-primary-600)] transition-colors">
            Masuk
          </Link>
          <Button asChild variant="primary" size="sm">
            <Link href="/register">Daftar Gratis</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] rounded-full text-caption font-semibold mb-6 border border-[var(--color-primary-200)]">
            <Sparkles className="w-4 h-4" /> Platform Undangan Digital #1
          </div>
          <h1 className="text-display-md md:text-display-xl font-display font-bold text-[var(--color-neutral-900)] mb-6 leading-tight">
            Bagikan Momen Bahagia Anda dengan Lebih <span className="text-[var(--color-primary-600)] italic">Elegan</span>.
          </h1>
          <p className="text-body-lg text-[var(--color-neutral-600)] md:text-h4 font-light max-w-2xl mb-10 leading-relaxed">
            Buat undangan pernikahan digital yang cantik, responsif, eksklusif, dan sesuai budaya Indonesia dalam hitungan menit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild variant="primary" size="lg" className="text-lg px-8">
              <Link href="/register">Buat Undangan Sekarang</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-lg px-8 bg-white">
              <Link href="/u/sample">Lihat Demo</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-24 px-6 border-y border-[var(--color-neutral-200)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-h2 font-display font-bold text-[var(--color-neutral-900)] mb-4">Kenapa Memilih NikahKu?</h2>
              <p className="text-body-lg text-[var(--color-neutral-500)] max-w-xl mx-auto">Semua fitur yang Anda butuhkan untuk membagikan kabar bahagia dengan sempurna terpikirkan oleh kami.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--color-surface-page)] border border-[var(--color-neutral-100)] transition-transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center text-[var(--color-primary-600)] mb-6">
                  <MonitorSmartphone className="w-8 h-8" />
                </div>
                <h3 className="text-h4 font-display font-bold mb-3">Tampilan Responsif</h3>
                <p className="text-[var(--color-neutral-600)]">Undangan Anda akan terlihat cantik dan sempurna di segala ukuran layar, dari handphone hingga laptop.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--color-surface-page)] border border-[var(--color-neutral-100)] transition-transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full bg-[var(--color-accent-100)] flex items-center justify-center text-[var(--color-accent-600)] mb-6">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-h4 font-display font-bold mb-3">Tema Estetik</h3>
                <p className="text-[var(--color-neutral-600)]">Pilihan ratusan tema eksklusif yang disesuaikan dengan beragam budaya pernikahan di Indonesia.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--color-surface-page)] border border-[var(--color-neutral-100)] transition-transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full bg-[var(--color-success-light)] flex items-center justify-center text-[var(--color-success-dark)] mb-6">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-h4 font-display font-bold mb-3">Amplop Digital</h3>
                <p className="text-[var(--color-neutral-600)]">Memudahkan tamu undangan untuk memberikan tanda kasih secara modern, cashless, dan praktis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto bg-[var(--color-neutral-900)] rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-h2 font-display font-bold mb-6 text-white">Mulai Perjalanan Anda Bersama Kami</h2>
            <p className="text-body-lg text-neutral-300 md:text-h4 font-light mb-10 leading-relaxed max-w-xl mx-auto">
              Pendaftaran gratis, bayar hanya jika Anda siap mempublikasikan undangan untuk tamu.
            </p>
            <Button asChild variant="primary" size="lg" className="text-lg px-8 border-none bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-400)] text-white">
              <Link href="/register">Buat Akun Sekarang</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[var(--color-neutral-200)] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-h4 font-display font-bold text-[var(--color-primary-600)]">NikahKu</span>
            <span className="text-neutral-400 text-sm">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-[var(--color-neutral-500)]">
            <Link href="#" className="hover:text-[var(--color-primary-600)] transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-[var(--color-primary-600)] transition-colors">Kebijakan Privasi</Link>
            <Link href="/login" className="hover:text-[var(--color-primary-600)] transition-colors">Admin Area</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

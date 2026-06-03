/* Landing navigation for the Landing Page undang-io mockup. */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";

const navItems = [
  { label: "Fitur", href: "#fitur" },
  { label: "Tema", href: "#tema" },
  { label: "Harga", href: "#harga" },
  { label: "Testimoni", href: "#testimoni" },
] as const;

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-landing-border/80 bg-landing-paper/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center text-landing-maroon" aria-label="Beranda undang.io">
          <BrandLogo size="nav" priority />
        </Link>

        <nav className="hidden items-center gap-9 font-ui text-sm font-medium text-landing-ink md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-landing-maroon">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 font-ui text-sm font-semibold">
          <Link href="/login" className="hidden text-landing-ink transition-colors hover:text-landing-maroon sm:inline-flex">
            Masuk
          </Link>
          <Link
            href="/buat-undangan"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-landing-maroon px-4 text-white shadow-landing-button transition hover:bg-landing-maroon-dark sm:px-6"
          >
            <span className="hidden sm:inline">Buat Undangan Gratis</span>
            <span className="sm:hidden">Buat Gratis</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

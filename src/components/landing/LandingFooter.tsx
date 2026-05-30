/* Footer for the Landing Page undang-io mockup. */

import Link from "next/link";
import { Sprout } from "lucide-react";

const links = [
  { label: "Fitur", href: "#fitur" },
  { label: "Tema", href: "#tema" },
  { label: "Harga", href: "#harga" },
  { label: "Blog", href: "#" },
  { label: "Kontak", href: "#" },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-landing-border bg-landing-paper px-4 py-5 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
        <div>
          <Link href="/" className="flex items-center justify-center gap-2 text-landing-maroon md:justify-start">
            <span className="font-landing-serif text-2xl font-semibold leading-none">undang.io</span>
            <Sprout className="h-5 w-5 text-landing-gold" aria-hidden="true" />
          </Link>
          <p className="mt-1 text-center font-ui text-xs text-landing-muted md:text-left">Undangan digital untuk momen terindahmu.</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-7 font-ui text-sm font-medium text-landing-ink">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="transition-colors hover:text-landing-maroon">
              {link.label}
            </a>
          ))}
        </nav>

        <p className="font-ui text-xs text-landing-muted">© 2026 undang.io</p>
      </div>
    </footer>
  );
}

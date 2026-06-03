/* Shared authentication shell based on docs/design/authlogin & authregister — Authentication Pages.png. */

import Link from "next/link";
import { Flower2, Leaf, Star } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";

type AuthShellProps = {
  children: React.ReactNode;
  compact?: boolean;
};

export function AuthShell({ children, compact = false }: AuthShellProps) {
  if (compact) {
    return (
      <main className="min-h-screen bg-landing-paper px-4 py-8 text-landing-ink sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center">
          <Link href="/" className="mb-8 inline-flex rounded-2xl bg-white px-5 py-3 shadow-landing-card" aria-label="Beranda undang.io">
            <BrandLogo size="nav" priority />
          </Link>
          {children}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-landing-paper text-landing-ink lg:grid lg:grid-cols-[0.72fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-landing-maroon text-white lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(201,168,76,0.18),transparent_36%)]" />
        <Flower2 className="absolute left-8 top-8 h-28 w-28 text-white/18" aria-hidden="true" />
        <Flower2 className="absolute right-10 top-20 h-24 w-24 text-white/14" aria-hidden="true" />
        <Leaf className="absolute bottom-16 right-10 h-44 w-44 text-white/16" aria-hidden="true" />
        <Leaf className="absolute bottom-32 left-8 h-28 w-28 text-white/12" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-md px-10 text-center">
          <Link
            href="/"
            className="inline-flex rounded-[28px] bg-white px-8 py-5 shadow-2xl shadow-black/15"
            aria-label="Beranda undang.io"
          >
            <BrandLogo size="authHero" priority />
          </Link>
          <p className="mt-5 font-landing-serif text-2xl italic leading-snug text-white/92">
            Undangan pernikahan digital
            <br />
            yang tak terlupakan
          </p>
          <div className="mx-auto my-12 flex max-w-xs items-center gap-4 text-white/70">
            <span className="h-px flex-1 bg-white/45" />
            <Flower2 className="h-6 w-6" aria-hidden="true" />
            <span className="h-px flex-1 bg-white/45" />
          </div>
          <blockquote className="font-landing-serif text-2xl italic leading-snug text-white/95">
            “Tamu kami takjub dengan undangan digitalnya. Simpel tapi elegan banget!”
          </blockquote>
          <p className="mt-7 font-ui text-sm font-medium text-white/90">Rizky & Amara, Desember 2025</p>
          <div className="mt-5 flex justify-center gap-3 text-landing-gold" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-6 w-6 fill-current" />
            ))}
          </div>
        </div>

        <p className="absolute bottom-6 left-8 z-10 font-ui text-sm text-white/88">© 2026 undang.io</p>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">{children}</section>
    </main>
  );
}

/* Authentication mode tabs based on docs/design/authlogin & authregister — Authentication Pages.png. */

import Link from "next/link";
import { cn } from "@/lib/utils";

type AuthTabsProps = {
  active: "login" | "register";
};

export function AuthTabs({ active }: AuthTabsProps) {
  return (
    <div className="grid h-14 grid-cols-2 rounded-full border border-landing-border bg-white p-1 font-ui text-base font-bold">
      <Link
        href="/login"
        className={cn(
          "flex items-center justify-center rounded-full transition",
          active === "login" ? "bg-landing-gold text-white shadow-landing-button" : "text-landing-ink hover:text-landing-maroon",
        )}
      >
        Masuk
      </Link>
      <Link
        href="/register"
        className={cn(
          "flex items-center justify-center rounded-full transition",
          active === "register" ? "bg-landing-gold text-white shadow-landing-button" : "text-landing-ink hover:text-landing-maroon",
        )}
      >
        Daftar
      </Link>
    </div>
  );
}

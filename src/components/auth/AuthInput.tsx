/* Authentication input field based on docs/design/authlogin & authregister — Authentication Pages.png. */

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: React.ReactNode;
  right?: React.ReactNode;
};

export function AuthInput({ label, icon, right, className, id, ...props }: AuthInputProps) {
  return (
    <label className="block font-ui text-sm font-semibold text-landing-ink" htmlFor={id}>
      {label}
      <span className="relative mt-2 block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-landing-muted">{icon}</span>
        <input
          id={id}
          className={cn(
            "h-14 w-full rounded-lg border border-landing-border bg-white px-12 font-ui text-base text-landing-ink outline-none transition placeholder:text-landing-muted/65 focus:border-landing-gold focus:ring-2 focus:ring-landing-gold/20",
            right && "pr-14",
            className,
          )}
          {...props}
        />
        {right ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-landing-muted">{right}</span> : null}
      </span>
    </label>
  );
}

import type { ReactNode } from "react";

type MobilePhoneFrameProps = {
  children: ReactNode;
};

export function MobilePhoneFrame({ children }: MobilePhoneFrameProps) {
  return (
    <div className="relative mx-auto w-full max-w-[318px] sm:max-w-[350px]">
      <div className="absolute inset-x-10 bottom-0 h-16 translate-y-6 rounded-full bg-landing-maroon/15 blur-3xl" aria-hidden="true" />
      <div className="relative rounded-[3rem] border border-white/70 bg-[#211A1B] p-[9px] shadow-landing-phone ring-1 ring-landing-ink/15">
        <div className="absolute left-1/2 top-3 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-[#171213]" aria-hidden="true" />
        <div className="relative aspect-[9/17.8] overflow-hidden rounded-[2.35rem] bg-landing-paper">{children}</div>
      </div>
    </div>
  );
}

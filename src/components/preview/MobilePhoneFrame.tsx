import type { ReactNode } from "react";

export const MOBILE_PHONE_WIDTH = 375;
export const MOBILE_PHONE_HEIGHT = 812;

type MobilePhoneFrameProps = {
  children: ReactNode;
  scale?: number;
};

export function MobilePhoneFrame({ children, scale = 1 }: MobilePhoneFrameProps) {
  return (
    <div
      className="relative shrink-0"
      style={{
        width: MOBILE_PHONE_WIDTH * scale,
        height: MOBILE_PHONE_HEIGHT * scale,
      }}
    >
      <div
        className="absolute left-1/2 top-0 h-[812px] w-[375px] -translate-x-1/2 rounded-[48px] border border-white/25 bg-neutral-900 p-[12px] shadow-landing-phone ring-1 ring-black/20"
        style={{
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <div className="absolute left-1/2 top-[18px] z-20 h-[24px] w-[104px] -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
        <div className="relative h-full w-full overflow-hidden rounded-[38px] bg-white shadow-inner">
          <div className="h-full w-full overflow-y-auto overscroll-contain">{children}</div>
        </div>
      </div>
    </div>
  );
}

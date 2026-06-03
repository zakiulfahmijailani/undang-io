/* Shared undang.io logo component using the current PNG brand lockup. */

import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoSize = "nav" | "footer" | "wizard" | "sidebar" | "ownerSidebar" | "authHero";

type BrandLogoProps = {
  size?: BrandLogoSize;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

const logoDimensions: Record<BrandLogoSize, { width: number; height: number }> = {
  nav: { width: 132, height: 44 },
  footer: { width: 116, height: 39 },
  wizard: { width: 144, height: 48 },
  sidebar: { width: 192, height: 64 },
  ownerSidebar: { width: 192, height: 64 },
  authHero: { width: 240, height: 80 },
};

export function BrandLogo({ size = "nav", priority = false, className, imageClassName }: BrandLogoProps) {
  const dimensions = logoDimensions[size];

  return (
    <span className={cn("inline-flex items-center justify-center", className)}>
      <Image
        src="/logo_undang_io.png"
        alt="undang.io logo"
        width={dimensions.width}
        height={dimensions.height}
        priority={priority}
        className={cn("object-contain", imageClassName)}
      />
    </span>
  );
}

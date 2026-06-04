import { Cormorant_Garamond, DM_Sans, Great_Vibes, Scheherazade_New } from "next/font/google";

const petalSoftScript = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-petal-soft-script",
});

const petalSoftSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-petal-soft-serif",
});

const petalSoftBody = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-petal-soft-body",
});

const petalSoftArabic = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-petal-soft-arabic",
});

export const petalSoftFontClassName = [
  petalSoftScript.variable,
  petalSoftSerif.variable,
  petalSoftBody.variable,
  petalSoftArabic.variable,
].join(" ");

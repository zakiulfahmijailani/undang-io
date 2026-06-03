import { Amiri, Cormorant_Garamond, DM_Sans, Pinyon_Script } from "next/font/google";

const fatehaScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fateha-script",
});

const fatehaSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fateha-serif",
});

const fatehaBody = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-fateha-body",
});

const fatehaArabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-fateha-arabic",
});

export const fatehaFontClassName = [
  fatehaScript.variable,
  fatehaSerif.variable,
  fatehaBody.variable,
  fatehaArabic.variable,
].join(" ");

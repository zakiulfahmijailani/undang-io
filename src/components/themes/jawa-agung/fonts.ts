import { Cinzel_Decorative, Cormorant_Garamond, Lora, Pinyon_Script, Scheherazade_New } from "next/font/google";

const jawaHeading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-jawa-heading",
});

const jawaScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jawa-script",
});

const jawaBody = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-jawa-body",
});

const jawaDisplay = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jawa-display",
});

const jawaArabic = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "500"],
  variable: "--font-jawa-arabic",
});

export const jawaAgungFontClassName = [
  jawaHeading.variable,
  jawaScript.variable,
  jawaBody.variable,
  jawaDisplay.variable,
  jawaArabic.variable,
].join(" ");

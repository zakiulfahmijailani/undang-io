import { Bodoni_Moda, Cormorant_Garamond, Jost, Scheherazade_New } from "next/font/google";

const obsidianHeading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-obsidian-heading",
});

const obsidianScript = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-obsidian-script",
});

const obsidianBody = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-obsidian-body",
});

const obsidianArabic = Scheherazade_New({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-obsidian-arabic",
});

export const obsidianLuxeFontClassName = [
  obsidianHeading.variable,
  obsidianScript.variable,
  obsidianBody.variable,
  obsidianArabic.variable,
].join(" ");

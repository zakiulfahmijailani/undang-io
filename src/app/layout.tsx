import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono, Dancing_Script, Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";
import DevNavLoader from "@/components/dev/DevNavLoader";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vibes",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif-wedding",
});

export const metadata: Metadata = {
  title: "umuman - Platform Undangan Digital",
  description: "Platform undangan digital paling mudah digunakan dan paling cantik di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${plusJakartaSans.variable} ${cormorant.variable} ${jetbrainsMono.variable} ${dancingScript.variable} ${greatVibes.variable} ${playfairDisplay.variable} antialiased font-body text-neutral-700 bg-surface-page`}
      >
        {children}
        <DevNavLoader />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Plus_Jakarta_Sans, JetBrains_Mono, Dancing_Script, Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";
import DevNavLoader from "@/components/dev/DevNavLoader";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
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
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${cormorant.variable} ${jetbrainsMono.variable} ${dancingScript.variable} ${greatVibes.variable} ${playfairDisplay.variable} antialiased font-body text-on-surface bg-surface-container-low selection:bg-tertiary-fixed-dim`}
      >
        {children}
        <DevNavLoader />
      </body>
    </html>
  );
}

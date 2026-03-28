import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono, Dancing_Script, Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";
import DevNavLoader from "@/components/dev/DevNavLoader";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

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
  title: "undang.io - Platform Undangan Digital",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${cormorant.variable} ${jetbrainsMono.variable} ${dancingScript.variable} ${greatVibes.variable} ${playfairDisplay.variable} antialiased font-body text-on-surface bg-surface`}
      >
        {children}
        <DevNavLoader />
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            duration: 4000,
            classNames: {
              toast: "font-body",
            },
          }}
        />
      </body>
    </html>
  );
}

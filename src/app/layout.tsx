import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import DevNavLoader from "@/components/dev/DevNavLoader";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
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
      <body
        className={`${plusJakartaSans.variable} antialiased font-body text-on-surface bg-surface`}
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

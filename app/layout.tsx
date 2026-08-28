import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import BottomNav from "@/components/BottomNav";
import { ExhibitionOverlayProvider } from "@/contexts/ExhibitionOverlayContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TFAM — Audio Guide",
  description: "Taipei Fine Arts Museum audio guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <MotionConfig reducedMotion="user">
            {/* BottomNav must be a descendant of the Provider — it consumes
                useExhibitionOverlay() to close the overlay before navigating
                away (see BottomNav.tsx). DOM order relative to the overlay
                (rendered internally by the Provider, after these children)
                doesn't matter for stacking: BottomNav's z-40 beats the
                overlay's z-30 regardless. */}
            <ExhibitionOverlayProvider>
              <PageTransitionWrapper>{children}</PageTransitionWrapper>
              <BottomNav />
            </ExhibitionOverlayProvider>
          </MotionConfig>
        </body>
    </html>
  );
}

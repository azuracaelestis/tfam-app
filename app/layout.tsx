import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import { MotionConfig } from "motion/react";
import Script from "next/script";
import "./globals.css";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
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
      // The splash-gate script (below) sets data-splash="pending" on this
      // element before hydration, intentionally diverging from the
      // server-rendered markup — the same documented exception React's
      // suppressHydrationWarning exists for (theme-flash-prevention scripts
      // use this exact pattern).
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          {/* Live prototype: the splash plays on every load, no persisted
              "seen" flag. This still has to run pre-hydration, so the
              solid-black CSS cover (app/globals.css) or a flash of visible
              Home is never a race. */}
          <Script id="splash-gate" strategy="beforeInteractive">
            {`document.documentElement.setAttribute('data-splash','pending');`}
          </Script>
          <SplashScreen />
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

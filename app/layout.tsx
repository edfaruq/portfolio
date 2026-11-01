import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Manrope } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Cursor } from "@/components/fx/Cursor";
import { PageTransition } from "@/components/fx/PageTransition";
import { Preloader } from "@/components/fx/Preloader";
import { Ripples } from "@/components/fx/Ripples";
import { RouteScrollReset, SmoothScroll } from "@/components/fx/SmoothScroll";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const sans = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · ${profile.role}`,
    template: `%s · ${profile.shortName}`,
  },
  description: `${profile.name}, ${profile.role.toLowerCase()} in Indonesia. ${profile.tagline}`,
  authors: [{ name: profile.name }],
  openGraph: { type: "website", siteName: profile.name, locale: "en_US" },
};

export const viewport: Viewport = { themeColor: "#0d0e0b" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-lime focus:px-3 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Suspense fallback={null}>
            <PageTransition />
            <RouteScrollReset />
          </Suspense>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Ripples />
          <Cursor />
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}

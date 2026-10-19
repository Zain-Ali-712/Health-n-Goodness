import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FormAria } from "@/components/layout/FormAria";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AddedToast } from "@/components/cart/AddedToast";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", axes: ["opsz"] });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Health n Goodness | Fresh juices, shakes & detox in Lahore",
    template: "%s | Health n Goodness",
  },
  description:
    "Fresh juices, shakes, smoothies and detox, made to order at four branches across Lahore: Model Town, Gulberg, DHA Phase 1 and DHA Phase 2.",
  openGraph: {
    title: "Health n Goodness",
    description: "Organic. Fresh. Healthy. Juices, shakes, smoothies and detox across Lahore.",
    images: [{ url: "/img/posters/squeeze-the-day.webp" }],
  },
};

export const viewport: Viewport = { themeColor: "#f3f6ef" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${geist.variable}`}>
      <body className="min-h-dvh">
        <MotionProvider>
        <StoreProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-surface"
          >
            Skip to content
          </a>
          <SmoothScroll />
          <FormAria />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <AuthDialog />
          <AddedToast />
        </StoreProvider>
        </MotionProvider>
      </body>
    </html>
  );
}

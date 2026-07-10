import type { Metadata } from "next";
import { Inter, Space_Grotesk, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { LanguageProvider } from "@/components/language-provider";
import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { getLocale } from "@/lib/locale-server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "PixelVault — Premium Digital Design Marketplace",
    template: "%s · PixelVault",
  },
  description:
    "Buy premium web templates, app designs, Blender 3D characters and UI kits. Instant downloads, commercial license, custom design requests. በአማርኛም ይገኛል።",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${notoEthiopic.variable} antialiased`}
      >
        <LanguageProvider initialLocale={locale}>
          <StoreProvider>
            <Navbar />
            <main className="min-h-screen pt-[61px]">{children}</main>
            <CartDrawer />
          </StoreProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

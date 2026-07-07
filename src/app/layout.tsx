import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PixelVault — Premium Digital Design Marketplace",
    template: "%s · PixelVault",
  },
  description:
    "Buy premium web templates, app designs, Blender 3D characters, UI kits, animations and illustrations. Instant downloads, commercial license, custom design requests.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <StoreProvider>
          <Navbar />
          <main className="min-h-screen pt-[61px]">{children}</main>
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}

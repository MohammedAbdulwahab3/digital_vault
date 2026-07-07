import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "__PRODUCT_NAME__",
  description: "__PRODUCT_DESCRIPTION__",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

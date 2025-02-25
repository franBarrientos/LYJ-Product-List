import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CartProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LYJ Joyas - Relojes",
  description: "Colección exclusiva de relojes de lujo",
  generator: "v0.dev",
  icons: {
    icon: "/logo-lyj.ico", // ✅ Ruta del favicon
    apple: "/logo-lyj.png", // (Opcional para iOS)
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

import "./globals.css";

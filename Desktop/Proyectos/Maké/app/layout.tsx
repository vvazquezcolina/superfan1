import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://make-reposteria.vercel.app'),
  title: "MAKÉ Repostería - Para endulzar tu alma",
  description: "Repostería artesanal en Guadalajara desde 2016. Pasteles, brownies, cupcakes y más, hechos con amor para endulzar tu alma.",
  keywords: ["repostería", "Guadalajara", "pasteles", "brownies", "cupcakes", "postres artesanales", "MAKÉ"],
  authors: [{ name: "MAKÉ Repostería" }],
  openGraph: {
    title: "MAKÉ Repostería - Para endulzar tu alma",
    description: "Repostería artesanal en Guadalajara desde 2016. Pasteles, brownies, cupcakes y más, hechos con amor.",
    url: 'https://make-reposteria.vercel.app',
    siteName: 'MAKÉ Repostería',
    images: [
      {
        url: '/api/placeholder/1200/630',
        width: 1200,
        height: 630,
        alt: 'MAKÉ Repostería - Deliciosos postres artesanales',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MAKÉ Repostería - Para endulzar tu alma",
    description: "Repostería artesanal en Guadalajara desde 2016. Pasteles, brownies, cupcakes y más, hechos con amor.",
    images: ['/api/placeholder/1200/630'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

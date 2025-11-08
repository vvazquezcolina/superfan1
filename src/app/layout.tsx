import type { Metadata } from "next";
import { Work_Sans, Poppins } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Superfan Cancún 2025 | Universidad del Caribe",
  description:
    "Evento Superfan Cancún 2025: integración universitaria, actividades culturales y participación especial de la 45 Muestra Nacional de Teatro en la Universidad del Caribe.",
  metadataBase: new URL("https://superfaninfo.com"),
  authors: [{ name: "Universidad del Caribe" }],
  keywords: [
    "Superfan Cancún",
    "Universidad del Caribe",
    "45 Muestra Nacional de Teatro",
    "evento universitario México",
    "actividades culturales Cancún",
  ],
  alternates: {
    canonical: "https://superfaninfo.com/",
  },
  openGraph: {
    title: "Superfan Cancún 2025 | Universidad del Caribe",
    description:
      "Del 17 de noviembre al 12 de diciembre vive el encuentro universitario más grande de Cancún con actividades integradoras y teatro nacional.",
    url: "https://superfaninfo.com/",
    siteName: "Superfan Cancún 2025",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/logo-superfan.png",
        width: 1024,
        height: 1024,
        alt: "Superfan Cancún 2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Superfan Cancún 2025 | Universidad del Caribe",
    description:
      "Actividades integradoras, cultura y teatro nacional en la Universidad del Caribe.",
    images: [
      {
        url: "/logo-superfan.png",
        alt: "Superfan Cancún 2025",
      },
    ],
  },
  icons: {
    icon: "/logo-superfan.png",
    shortcut: "/logo-superfan.png",
    apple: "/logo-superfan.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${workSans.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-neutral-50 font-sans text-foreground antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand focus:shadow-lg"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}

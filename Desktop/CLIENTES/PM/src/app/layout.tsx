
import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import RootLayoutClient from './RootLayoutClient';
import { ThemeProvider } from '@/context/ThemeContext'; // Import ThemeProvider

export const metadata: Metadata = {
  title: 'Puerto Maya Cancún - Cinco Experiencias, Un Tour Épico | Lanchas Rápidas, Snorkel & Cultura Maya',
  description: 'Vive lo mejor de Cancún con Puerto Maya: aventuras en lancha rápida, snorkel en el Gran Arrecife Maya, auténticas ceremonias mayas, shows prehispánicos y deliciosa gastronomía maya. ¡Reserva tu épico tour 5 en 1 hoy!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider> {/* Wrap LanguageProvider with ThemeProvider */}
      <LanguageProvider>
        <RootLayoutClient metadata={metadata}>
          {children}
        </RootLayoutClient>
      </LanguageProvider>
    </ThemeProvider>
  );
}

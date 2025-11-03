import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WANTED VIBES — Test',
  description: 'Qué VIBE te busca — test oficial de VIBES.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

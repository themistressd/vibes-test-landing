import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WANTED VIBES — Test',
  description: 'Qué VIBE te busca — test oficial de VIBES.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Script id="strip-extension-attrs" strategy="beforeInteractive">
          {`if (typeof document !== 'undefined') { document.documentElement.removeAttribute('webcrx'); }`}
        </Script>
      </body>
    </html>
  );
}

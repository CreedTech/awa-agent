import type { Metadata, Viewport } from 'next';
import {
  Schibsted_Grotesk,
  Hanken_Grotesk,
  Space_Mono,
} from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { PublicTopNav } from '@/components/layout/top-nav';

const display = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'optional',
  preload: false,
  fallback: ['system-ui', 'Arial'],
});

const body = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'optional',
  preload: false,
  fallback: ['system-ui', 'Arial'],
});

const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'optional',
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

export const metadata: Metadata = {
  title: {
    default: 'AwaAgent - Escrow-protected rentals in Nigeria',
    template: '%s · AwaAgent',
  },
  description:
    'Browse live rental listings in Ibadan and request in-person inspections through AwaAgent.',
  applicationName: 'AwaAgent',
  keywords: [
    'AwaAgent',
    'rentals Nigeria',
    'Ibadan rentals',
    'property inspections',
    'Ibadan homes',
  ],
};

export const viewport: Viewport = {
  themeColor: '#001f3f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      style={{ background: '#f3f5f8', color: '#0b1f38' }}
    >
      <body
        suppressHydrationWarning
        style={{ background: '#f3f5f8', color: '#0b1f38' }}
      >
        <Providers>
            {/* <PublicTopNav /> */}
          {children}
          </Providers>
      </body>
    </html>
  );
}

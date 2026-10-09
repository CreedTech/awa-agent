import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, DM_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';
import './site.css';
import { Providers } from './providers';
import { env } from '@/lib/env';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  fallback: ['system-ui', 'Arial'],
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', 'Arial'],
});

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  title: {
    default: 'AwaAgent - Rent a home you have inspected in person',
    template: '%s · AwaAgent',
  },
  description: 'Browse rentals with the first-year rent shown, inspect in person with the assigned agent, and get the exact address only after your visit is verified.',
  applicationName: 'AwaAgent',
  keywords: ['AwaAgent', 'rentals Nigeria', 'homes for rent', 'property inspections'],
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
    >
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

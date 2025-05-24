import type { Metadata } from 'next';
import { Hind, Oswald } from 'next/font/google';
import { NavigationWrapper } from '@/components/navigation/NavigationWrapper';
import { NewsTicker } from '@/components/news/NewsTicker';
import { Providers } from './providers';
import './globals.css';

const hind = Hind({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind'
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald'
});

export const metadata: Metadata = {
  title: 'Panel Profits',
  description: 'Comic Book Trading Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${hind.variable} ${oswald.variable}`}>
      <body className="bg-slate-900 min-h-screen">
        <Providers>
          <NavigationWrapper />
          <NewsTicker />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
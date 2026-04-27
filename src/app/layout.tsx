import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppFrame } from '@/components/common/AppFrame';
import { ReduxProvider } from '@/providers/ReduxProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Frontline - Workforce Intelligence Platform',
  description:
    'AI-powered workforce analytics and scenario modeling for public safety organizations',
  keywords: ['workforce', 'analytics', 'public safety', 'SaaS', 'AI'],
  authors: [{ name: 'Frontline' }],
};
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ReduxProvider>
          <AppFrame>{children}</AppFrame>
        </ReduxProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { ClientProviders } from '@/components/client-providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Habit Coin — 디지털 미니멀리스트',
  description: '습관을 만들고, 코인을 획득하고, 목표를 달성하세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

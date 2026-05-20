import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050508' },
    { media: '(prefers-color-scheme: light)', color: '#00D4FF' },
  ],
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'GoPay - Pagamentos Inteligentes para Negócios Modernos',
  description: 'Plataforma completa de pagamentos digitais, links de pagamento personalizados, checkouts inteligentes e criação de landing pages premium com IA integrada.',
  keywords: 'pagamentos, pix, checkout, link de pagamento, saas, fintech',
  authors: [{ name: 'GoPay' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GoPay',
  },
  openGraph: {
    title: 'GoPay - Pagamentos Inteligentes',
    description: 'Plataforma completa de pagamentos digitais',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GoPay" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-gopay-darker text-white overscroll-none">
        {children}
      </body>
    </html>
  );
}

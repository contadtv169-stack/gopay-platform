import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GoPay - Pagamentos Inteligentes para Negócios Modernos',
  description: 'Plataforma completa de pagamentos digitais, links de pagamento personalizados, checkouts inteligentes e criação de landing pages premium com IA integrada.',
  keywords: 'pagamentos, pix, checkout, link de pagamento, saas, fintech',
  authors: [{ name: 'GoPay' }],
  openGraph: {
    title: 'GoPay - Pagamentos Inteligentes',
    description: 'Plataforma completa de pagamentos digitais',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-gopay-darker text-white">
        {children}
      </body>
    </html>
  );
}

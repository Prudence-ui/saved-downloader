import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import Menu from '@/app/components/Menu';
import Footer from '@/app/components/Footer';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SAVED',
  description: 'Téléchargeur de vidéos multi-plateformes',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  // ✅ OBLIGATOIRE AVEC NEXT 16
  const { locale = 'fr' } = await params;

  // ✅ Sécurité si langue inexistante
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../../messages/fr.json`)).default;
  }

  return (
    <html lang={locale}>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          min-h-screen
          text-white
          bg-gradient-to-br 
          from-[#0b0f1a] 
          via-[#0e1325] 
          to-[#090d18]
        `}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Menu />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

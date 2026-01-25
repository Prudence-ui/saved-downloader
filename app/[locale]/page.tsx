'use client';

import Link from 'next/link';
import AdBanner from '@/app/components/AdBanner';
import { useLocale } from '@/app/hooks/useLocale';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations('home');

  return (
    <main className="min-h-screen w-full flex flex-col items-center px-4 bg-transparent">
      
      {/* 🔥 PUB EN HAUT */}
      <AdBanner platform="youtube" />

      <div className="w-full max-w-xl flex flex-col items-center gap-6 mt-10">
        
        <h1 className="text-3xl font-bold text-center title-premium text-white">
          {t('title')}
        </h1>

        <p className="text-gray-300 text-center">
          {t('subtitle')}
        </p>

        {/* BOUTONS */}
        <div className="w-full flex flex-col gap-4 mt-4">
          <Link href={`/${locale}/instagram`} className="btn-glow w-full text-center">
            {t('instagram')}
          </Link>

          <Link href={`/${locale}/youtube`} className="btn-glow w-full text-center">
            {t('youtube')}
          </Link>

          <Link href={`/${locale}/facebook`} className="btn-glow w-full text-center">
            {t('facebook')}
          </Link>

          <Link href={`/${locale}/x`} className="btn-glow w-full text-center">
            {t('x')}
          </Link>

          <Link href={`/${locale}/tiktok`} className="btn-glow w-full text-center">
            {t('tiktok')}
          </Link>
        </div>
      </div>
    </main>
  );
}

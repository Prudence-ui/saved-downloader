'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="w-full mt-20 border-t border-white/10 py-6 text-center text-sm text-gray-400">
      
      <div className="flex justify-center gap-6 mb-2">
        <Link
          href={`/${locale}`}
          className="hover:text-white"
        >
          {t('home')}
        </Link>

        <Link
          href={`/${locale}/terms`}
          className="hover:text-white"
        >
          {t('terms')}
        </Link>

        <Link
          href={`/${locale}/contact`}
          className="hover:text-white"
        >
          {t('contact')}
        </Link>
      </div>

      <p className="text-xs opacity-60">
        © {new Date().getFullYear()} SAVED — {t('rights')}
      </p>
    </footer>
  );
}

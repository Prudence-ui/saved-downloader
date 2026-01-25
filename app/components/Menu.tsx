'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Menu() {
  const t = useTranslations('menu');
  const locale = useLocale();

  return (
    <header className="w-full flex items-center justify-between px-4 py-4">
      
      {/* MENU GAUCHE */}
      <nav className="flex items-center gap-4 text-sm">
        <Link
          href={`/${locale}`}
          className="hover:text-white text-gray-300"
        >
          {t('home')}
        </Link>

        <Link
          href={`/${locale}/help`}
          className="hover:text-white text-gray-300"
        >
          {t('help')}
        </Link>
      </nav>

      {/* DROITE : LANGUES + NOM DU SITE */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        <span className="text-lg font-bold tracking-wide">
          SAVED
        </span>
      </div>
    </header>
  );
}

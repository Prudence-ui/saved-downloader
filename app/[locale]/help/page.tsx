'use client';

import { useTranslations } from 'next-intl';

export default function HelpPage() {
  const t = useTranslations('help');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">
        {t('title')}
      </h1>

      <p className="text-gray-300 max-w-xl">
        {t('description')}
      </p>
    </main>
  );
}

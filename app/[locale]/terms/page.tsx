'use client';

import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('terms');

  return (
    <main className="min-h-screen flex justify-center px-4 py-16">
      <div className="w-full max-w-3xl text-gray-300 space-y-6">

        <h1 className="text-3xl font-bold text-white">
          {t('title')}
        </h1>

        <p className="text-sm text-gray-400">
          {t('updated', {
            date: new Date().toLocaleDateString()
          })}
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            {t('section1.title')}
          </h2>
          <p>{t('section1.text')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            {t('section2.title')}
          </h2>
          <p>{t('section2.text')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            {t('section3.title')}
          </h2>
          <p>{t('section3.text')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            {t('section4.title')}
          </h2>
          <p>{t('section4.text')}</p>
        </section>

      </div>
    </main>
  );
}

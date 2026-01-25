'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import AdBanner from '@/app/components/AdBanner';
import PasteInput from '@/app/components/PasteInput';
import DownloadCounter from '@/app/components/DownloadCounter';
import InterstitialAd from '@/app/components/InterstitialAd';

export default function FacebookPage() {
  const t = useTranslations('facebook');

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (!url) {
      setError(t('error'));
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);
    setShowAd(true);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(t('success'));
      setUrl('');
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center px-4 bg-transparent">
      <AdBanner platform="facebook" />

      <div className="w-full max-w-xl flex flex-col items-center gap-6 mt-6">
        <h1 className="text-3xl font-bold text-white text-center">
          {t('title')}
        </h1>

        <PasteInput
          placeholder={t('placeholder')}
          value={url}
          onChange={setUrl}
          disabled={loading}
        />

        <button
          onClick={handleDownload}
          disabled={loading}
          className="btn-glow w-full"
        >
          {loading ? t('loading') : t('button')}
        </button>

        <DownloadCounter />

        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-400">{error}</p>}
      </div>

      <InterstitialAd
        open={showAd}
        onClose={() => setShowAd(false)}
        duration={20}
      />
    </main>
  );
}

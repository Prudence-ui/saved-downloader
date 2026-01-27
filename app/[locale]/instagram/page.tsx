'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import AdBanner from '@/app/components/AdBanner';
import PasteInput from '@/app/components/PasteInput';
import DownloadCounter from '@/app/components/DownloadCounter';
import InterstitialAd from '@/app/components/InterstitialAd';

export default function InstagramPage() {
  const t = useTranslations('instagram');

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (!url) {
      setError(t('error'));
      return;
    }

    setLoading(true);
    setError(null);
    setShowAd(true);

    try {
      const res = await fetch('http://localhost:3001/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const fileUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'instagram-video.mp4';
      link.click();

      URL.revokeObjectURL(fileUrl);
      setUrl('');
    } catch {
      setError('❌ Erreur téléchargement');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4">
      <AdBanner platform="instagram" />

      <div className="max-w-xl w-full flex flex-col gap-6 mt-6">
        <h1 className="text-3xl font-bold text-center">{t('title')}</h1>

        <PasteInput
          placeholder={t('placeholder')}
          value={url}
          onChange={setUrl}
          disabled={loading}
        />

        <button onClick={handleDownload} disabled={loading} className="btn-glow w-full">
          {loading ? t('loading') : t('button')}
        </button>

        <DownloadCounter />
        {error && <p className="text-red-400">{error}</p>}
      </div>

      <InterstitialAd open={showAd} onClose={() => setShowAd(false)} duration={20} />
    </main>
  );
}

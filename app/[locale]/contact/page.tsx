'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(t('success'));
      setEmail('');
      setMessage('');
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 text-gray-300"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          {t('title')}
        </h1>

        <input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/10 focus:outline-none"
        />

        <textarea
          placeholder={t('message')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/10 focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-glow w-full"
        >
          {loading ? t('sending') : t('send')}
        </button>

        {success && <p className="text-green-400 text-center">{success}</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}
      </form>
    </main>
  );
}

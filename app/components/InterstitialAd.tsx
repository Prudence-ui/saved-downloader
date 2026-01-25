'use client';

import { useEffect, useState } from 'react';

type InterstitialAdProps = {
  open: boolean;
  onClose: () => void;
  duration?: number; // en secondes (par défaut 20)
};

export default function InterstitialAd({
  open,
  onClose,
  duration = 20,
}: InterstitialAdProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!open) return;

    setTimeLeft(duration);

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, duration]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#0e1325] to-[#090d18] p-6 text-center shadow-2xl border border-white/10">

        {/* TEXTE PRINCIPAL */}
        <h2 className="text-xl font-bold text-white mb-2 animate-pulse">
          ⏳ Téléchargement en cours…
        </h2>

        <p className="text-gray-400 text-sm mb-4">
          Merci de patienter pendant la préparation de votre vidéo
        </p>

        {/* ESPACE PUBLICITAIRE */}
        <div className="h-32 rounded-xl bg-black/40 flex items-center justify-center text-gray-500 text-sm mb-4">
          📢 Espace publicitaire
        </div>

        {/* COMPTEUR */}
        {timeLeft > 0 ? (
          <p className="text-gray-400 text-sm">
            Vous pourrez fermer cette publicité dans{' '}
            <span className="text-white font-semibold">
              {timeLeft}s
            </span>
          </p>
        ) : (
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
          >
            Fermer
          </button>
        )}
      </div>
    </div>
  );
}

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const languages = [
  { code: 'fr', label: '🇫🇷 FR' },
  { code: 'en', label: '🇬🇧 EN' },
  { code: 'it', label: '🇮🇹 IT' },
  { code: 'de', label: '🇩🇪 DE' },
  { code: 'es', label: '🇪🇸 ES' },
  { code: 'pt', label: '🇵🇹 PT' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr');
  const ref = useRef<HTMLDivElement>(null);

  // Détecte langue depuis l’URL
  useEffect(() => {
    const segments = pathname.split('/');
    if (segments[1]) {
      setCurrentLang(segments[1]);
    }
  }, [pathname]);

  // Ferme au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function changeLanguage(code: string) {
    const segments = pathname.split('/');
    segments[1] = code;

    const newPath = segments.join('/') || `/${code}`;
    localStorage.setItem('lang', code);

    setOpen(false);
    router.push(newPath);
  }

  const currentLabel =
    languages.find((l) => l.code === currentLang)?.label ?? '🌍 Langue';

  return (
    <div className="relative text-sm" ref={ref}>
      {/* Bouton principal */}
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 rounded-md border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition"
      >
        🌍 {currentLabel}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 rounded-lg border border-white/10 bg-[#0e1325] shadow-lg z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full px-4 py-2 text-left transition whitespace-nowrap
                ${
                  currentLang === lang.code
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

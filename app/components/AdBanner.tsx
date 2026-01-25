type AdBannerProps = {
  platform: 'instagram' | 'youtube' | 'facebook' | 'x' | 'tiktok';
};

export default function AdBanner({ platform }: AdBannerProps) {
  const ads = {
    instagram: {
      title: '🚀 Boostez votre Instagram',
      text: 'Gagnez des abonnés et augmentez votre visibilité',
      color: 'from-pink-500 to-purple-600',
    },
    youtube: {
      title: '📺 Devenez YouTuber Pro',
      text: 'Optimisez vos vidéos et monétisez votre chaîne',
      color: 'from-red-500 to-red-700',
    },
    facebook: {
      title: '📘 Publicité Facebook efficace',
      text: 'Touchez plus de clients avec Facebook Ads',
      color: 'from-blue-500 to-blue-700',
    },
    x: {
      title: '🐦 Développez votre audience sur X',
      text: 'Stratégies de croissance sur Twitter / X',
      color: 'from-gray-700 to-black',
    },
    tiktok: {
      title: '🎵 Boostez vos TikTok',
      text: 'Augmentez vos vues et votre viralité',
      color: 'from-black via-gray-800 to-pink-600',
    },
  };

  const ad = ads[platform];

  return (
    <div
      className={`w-full max-w-xl mt-6 p-4 rounded-xl text-white text-center
      bg-gradient-to-r ${ad.color}
      shadow-lg animate-pulse`}
    >
      <h2 className="text-lg font-bold">{ad.title}</h2>
      <p className="text-sm opacity-90 mt-1">{ad.text}</p>
    </div>
  );
}

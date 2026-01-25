'use client';

import { useEffect, useState } from 'react';

export default function DownloadCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);

  if (count === null) return null;

  return (
    <div className="mt-4 text-sm text-gray-500 text-center">
      🔥 <span className="font-semibold">{count}</span> téléchargements effectués
    </div>
  );
}

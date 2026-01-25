import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json(
      { error: 'URL manquante' },
      { status: 400 }
    );
  }

  const downloadPath = path.join(
    process.env.USERPROFILE || '',
    'Downloads',
    'telechargement',
    'downloads',
    '%(id)s.%(ext)s'
  );

  const command = `
yt-dlp
-f "bv*+ba/b"
--merge-output-format mp4
--no-playlist
--user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
--add-header "Referer:https://www.tiktok.com/"
"${url}"
-o "${downloadPath}"
`;


  return new Promise((resolve) => {
    exec(command, async (error) => {
      if (error) {
        console.error(error);
        resolve(
          NextResponse.json(
            { error: error.message },
            { status: 500 }
          )
        );
        return;
      }

      // 🔥 Incrément compteur
      await fetch('http://localhost:3000/api/stats', {
        method: 'POST',
      });

      resolve(
        NextResponse.json({ success: true })
      );
    });
  });
}

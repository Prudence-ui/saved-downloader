import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const statsFile = path.join(process.cwd(), 'downloads-count.json');

function getCount(): number {
  if (!fs.existsSync(statsFile)) {
    fs.writeFileSync(statsFile, JSON.stringify({ count: 0 }));
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
  return data.count ?? 0;
}

export async function GET() {
  const count = getCount();
  return NextResponse.json({ count });
}

export async function POST() {
  const count = getCount() + 1;
  fs.writeFileSync(statsFile, JSON.stringify({ count }));
  return NextResponse.json({ count });
}

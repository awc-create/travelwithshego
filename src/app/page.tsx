// src/app/page.tsx
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import HomeClient from './HomeClient';
import { getHomeData } from '@/lib/getHomeData';

export const metadata: Metadata = {
  title: 'Baraawe Hope Center | Travel with Shego',
  // ...
};

function getBuildingImages(): string[] {
  const dir = path.join(process.cwd(), 'public', 'assets', 'building');

  try {
    const files = fs.readdirSync(dir);

    return files
      .filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file))
      .sort()
      .map((file) => `/assets/building/${file}`);
  } catch (err) {
    // Folder might not exist yet – fail quietly and return empty
    console.error('[getBuildingImages] Could not read public/assets/building', err);
    return [];
  }
}

export default async function HomePage() {
  const data = await getHomeData();
  const buildingImages = getBuildingImages(); // always an array

  return <HomeClient data={data} buildingImages={buildingImages} />;
}

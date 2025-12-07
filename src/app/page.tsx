// src/app/page.tsx
import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { getHomeData } from '@/lib/getHomeData';

export const metadata: Metadata = {
  title: 'Baraawe Hope Center | Travel with Shego',
  // ...
};

export default async function HomePage() {
  const data = await getHomeData();

  return <HomeClient data={data} />; // ✅ just data, no raised/goal props
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [hero, mission, gallery] = await Promise.all([
      prisma.heroHome.findUnique({ where: { key: 'home' } }),
      prisma.homeMission.findUnique({ where: { key: 'mission' } }),
      prisma.homeGallery.findUnique({ where: { key: 'gallery' } }),
    ]);

    return NextResponse.json({
      hero: hero ?? null,
      mission: mission ?? null,
      gallery: gallery ?? null,
    });
  } catch (err) {
    console.error('GET /api/home failed:', err);
    return NextResponse.json({ error: 'Failed to load home content' }, { status: 500 });
  }
}

// src/app/api/home/gallery/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEY = 'gallery';

export async function GET() {
  try {
    const g = await prisma.homeGallery.findUnique({ where: { key: KEY } });
    return NextResponse.json(
      g ?? {
        key: KEY,
        imageUrls: [],
        title: 'Moments of Hope',
        subtitle: 'Our journey in pictures',
        caption: 'Our journey in pictures',
      }
    );
  } catch (err) {
    console.error('GET /api/home/gallery failed:', err);
    return NextResponse.json({ error: 'Failed to load gallery' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<{
      imageUrls: string[];
      title?: string | null;
      subtitle?: string | null;
      caption?: string | null;
    }>;

    const saved = await prisma.homeGallery.upsert({
      where: { key: KEY },
      update: {
        imageUrls: body.imageUrls ?? [],
        title: body.title ?? null,
        subtitle: body.subtitle ?? null,
        caption: body.caption ?? null,
      },
      create: {
        key: KEY,
        imageUrls: body.imageUrls ?? [],
        title: body.title ?? null,
        subtitle: body.subtitle ?? null,
        caption: body.caption ?? null,
      },
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error('POST /api/home/gallery failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

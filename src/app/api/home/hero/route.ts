// src/app/api/home/hero/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEY = 'home';

export async function GET() {
  const hero = await prisma.heroHome.findUnique({ where: { key: KEY } });
  return NextResponse.json(
    hero ?? {
      key: KEY,
      imageSrc: '/assets/hero.png',
      title: 'Hope & Home for Baraawe&#39;s Children',
      description:
        'We&#39;re building a safe haven for orphans and struggling families — a place where every child can live, learn, and dream without fear.',
    }
  );
}

// keeping POST ready if you decide to re-enable editing later
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      imageSrc: string;
      title: string;
      description: string;
    };

    const hero = await prisma.heroHome.upsert({
      where: { key: KEY },
      create: { key: KEY, ...body },
      update: body,
    });

    return NextResponse.json(hero);
  } catch (err) {
    console.error('POST /api/home/hero failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

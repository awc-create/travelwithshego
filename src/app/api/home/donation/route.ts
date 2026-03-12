// src/app/api/home/donation/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEY = 'donation';

export async function GET() {
  try {
    const d = await prisma.homeDonation.findUnique({ where: { key: KEY } });
    return NextResponse.json(
      d ?? {
        key: KEY,
        title: 'Give Shelter & Hope',
        subtitle: 'Your gift creates safe housing, education and care in Baraawe.',
      }
    );
  } catch (err) {
    console.error('GET /api/home/donation failed:', err);
    return NextResponse.json({ error: 'Failed to load donation' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<{ title: string; subtitle?: string | null }>;

    if (!body.title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const data = {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() ?? null,
    };

    const saved = await prisma.homeDonation.upsert({
      where: { key: KEY },
      create: { key: KEY, ...data },
      update: data,
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error('POST /api/home/donation failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

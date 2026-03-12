import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEY = 'evidence';

type EvidenceItem =
  | {
      type: 'image';
      src: string;
      alt?: string;
      title?: string;
      caption?: string;
      date?: string;
      location?: string;
    }
  | {
      type: 'video';
      src: string;
      poster?: string;
      title?: string;
      caption?: string;
      date?: string;
      location?: string;
    };

export async function GET() {
  try {
    const evidence = await prisma.homeEvidence.findUnique({
      where: { key: KEY },
    });

    return NextResponse.json(
      evidence ?? {
        key: KEY,
        title: 'Evidence of Where Your Money Has Been Helping',
        subtitle:
          'Real updates from the ground — photos and video moments showing progress and impact.',
        items: [],
      }
    );
  } catch (err) {
    console.error('GET /api/home/evidence failed:', err);
    return NextResponse.json({ error: 'Failed to load evidence' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<{
      title: string;
      subtitle?: string | null;
      items: EvidenceItem[];
    }>;

    if (!body.title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const saved = await prisma.homeEvidence.upsert({
      where: { key: KEY },
      update: {
        title: body.title.trim(),
        subtitle: body.subtitle?.trim() ?? null,
        items: body.items ?? [],
      },
      create: {
        key: KEY,
        title: body.title.trim(),
        subtitle: body.subtitle?.trim() ?? null,
        items: body.items ?? [],
      },
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error('POST /api/home/evidence failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEY = 'testimonial';

export async function GET() {
  try {
    const t = await prisma.homeTestimonial.findUnique({ where: { key: KEY } });
    return NextResponse.json(
      t ?? {
        key: KEY,
        quote: 'When we educate one child, we educate the whole village.',
        author: 'Project Lead, Baraawe',
        role: 'Founder',
        avatarSrc: null,
      }
    );
  } catch (err) {
    console.error('GET /api/home/testimonial failed:', err);
    return NextResponse.json({ error: 'Failed to load testimonial' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<{
      quote: string;
      author: string;
      role?: string | null;
      avatarSrc?: string | null;
    }>;

    if (!body.quote || !body.author) {
      return NextResponse.json({ error: 'quote and author are required' }, { status: 400 });
    }

    const data = {
      quote: body.quote.trim(),
      author: body.author.trim(),
      role: body.role?.trim() ?? null,
      avatarSrc: body.avatarSrc?.trim() ?? null,
    };

    const saved = await prisma.homeTestimonial.upsert({
      where: { key: KEY },
      create: { key: KEY, ...data },
      update: data,
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error('POST /api/home/testimonial failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

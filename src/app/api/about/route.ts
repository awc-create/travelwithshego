import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEY = 'about';

export async function GET() {
  const about = await prisma.aboutUs.findUnique({ where: { key: KEY } });
  return NextResponse.json(
    about ?? {
      key: KEY,
      title: 'About Us',
      description: 'We’re a team of passionate developers turning ideas into reality.',
      bullets: ['🚀 Fast & scalable', '🎨 Design-driven', '🤝 Client-focused'],
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<{
      title: string;
      description: string;
      bullets: string[] | string;
    }>;

    const title = (body.title ?? '').toString().trim();
    const description = (body.description ?? '').toString().trim();
    const bullets = Array.isArray(body.bullets)
      ? body.bullets
      : (body.bullets ?? '')
          .toString()
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    if (!title || !description) {
      return NextResponse.json({ error: 'title and description are required.' }, { status: 400 });
    }

    const about = await prisma.aboutUs.upsert({
      where: { key: KEY },
      create: { key: KEY, title, description, bullets },
      update: { title, description, bullets },
    });

    return NextResponse.json(about);
  } catch (err) {
    console.error('POST /api/about failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

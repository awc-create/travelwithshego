// src/app/api/home/mission/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEY = 'mission';
const DEFAULTS = {
  title: 'Hope, Home, and a Path to the Future',
  description:
    'We’re building a safe haven in Baraawe — a place where vulnerable children and families can live, learn and heal.',
  familiesHoused: 0,
  childrenInCare: 0,
  mealsServed: 0,
};

export async function GET() {
  try {
    const mission = await prisma.homeMission.findUnique({ where: { key: KEY } });
    return NextResponse.json(mission ?? { key: KEY, ...DEFAULTS });
  } catch (err) {
    console.error('GET /api/home/mission failed:', err);
    return NextResponse.json({ error: 'Failed to load mission' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<{
      title: string;
      description: string;
      familiesHoused: number;
      childrenInCare: number;
      mealsServed: number;
    }>;

    // Build updateData only from provided fields
    const updateData = {
      ...(body.title !== undefined ? { title: body.title.trim() } : {}),
      ...(body.description !== undefined ? { description: body.description.trim() } : {}),
      ...(body.familiesHoused !== undefined ? { familiesHoused: body.familiesHoused } : {}),
      ...(body.childrenInCare !== undefined ? { childrenInCare: body.childrenInCare } : {}),
      ...(body.mealsServed !== undefined ? { mealsServed: body.mealsServed } : {}),
    };

    // Load current to synthesize a COMPLETE create payload
    const current = await prisma.homeMission.findUnique({ where: { key: KEY } });

    const createData = {
      key: KEY,
      title: body.title?.trim() ?? current?.title ?? DEFAULTS.title,
      description: body.description?.trim() ?? current?.description ?? DEFAULTS.description,
      familiesHoused: body.familiesHoused ?? current?.familiesHoused ?? DEFAULTS.familiesHoused,
      childrenInCare: body.childrenInCare ?? current?.childrenInCare ?? DEFAULTS.childrenInCare,
      mealsServed: body.mealsServed ?? current?.mealsServed ?? DEFAULTS.mealsServed,
    };

    const mission = await prisma.homeMission.upsert({
      where: { key: KEY },
      update: updateData,
      create: createData, // ✅ guaranteed complete
    });

    return NextResponse.json(mission);
  } catch (err) {
    console.error('POST /api/home/mission failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// src/app/api/admin/auction/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all items
export async function GET() {
  const items = await prisma.auctionItem.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(items);
}

// CREATE
export async function POST(req: Request) {
  const body = await req.json();

  const data = {
    slug: String(body.slug ?? '').trim(),
    title: String(body.title ?? '').trim(),
    description: String(body.description ?? '').trim(),
    imageUrl: body.imageUrl ? String(body.imageUrl).trim() : null,
    pricePence: Number(body.pricePence ?? 0),
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
    active: Boolean(body.active),
    endsAt: body.endsAt ? new Date(body.endsAt) : null,
  };

  const item = await prisma.auctionItem.create({ data });
  return NextResponse.json(item);
}

// UPDATE
export async function PUT(req: Request) {
  const body = await req.json();
  const id = String(body.id ?? '');

  if (!id) {
    return new NextResponse('Missing id', { status: 400 });
  }

  const data = {
    slug: String(body.slug ?? '').trim(),
    title: String(body.title ?? '').trim(),
    description: String(body.description ?? '').trim(),
    imageUrl: body.imageUrl ? String(body.imageUrl).trim() : null,
    pricePence: Number(body.pricePence ?? 0),
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
    active: Boolean(body.active),
    endsAt: body.endsAt ? new Date(body.endsAt) : null,
  };

  const updated = await prisma.auctionItem.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(req: Request) {
  const body = await req.json();
  const id = String(body.id ?? '');

  if (!id) {
    return new NextResponse('Missing id', { status: 400 });
  }

  await prisma.auctionItem.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

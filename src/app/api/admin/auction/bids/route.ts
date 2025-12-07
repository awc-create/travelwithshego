// src/app/api/admin/auction/bids/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId query parameter' }, { status: 400 });
    }

    const item = await prisma.auctionItem.findUnique({
      where: { id: itemId },
      select: { id: true, title: true, slug: true },
    });

    if (!item) {
      return NextResponse.json({ error: 'Auction item not found' }, { status: 404 });
    }

    const bids = await prisma.auctionBid.findMany({
      where: { auctionItemId: itemId },
      orderBy: [{ amountPence: 'desc' }, { createdAt: 'desc' }],
    });

    const safeBids = bids.map((b) => ({
      id: b.id,
      amountPence: b.amountPence,
      email: b.email,
      name: b.name,
      isWinner: b.isWinner,
      createdAt: b.createdAt.toISOString(),
    }));

    return NextResponse.json({
      item,
      bids: safeBids,
    });
  } catch (err) {
    console.error('[ADMIN_AUCTION_BIDS_ERROR]', err);
    return NextResponse.json({ error: 'Failed to load bids' }, { status: 500 });
  }
}

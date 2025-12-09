// src/app/api/auction/public/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.auctionItem.findMany({
      where: { active: true, closed: false },
      orderBy: { endsAt: 'asc' },
      include: {
        bids: {
          select: { amountPence: true },
          orderBy: { amountPence: 'desc' },
        },
      },
    });

    if (!items.length) {
      return NextResponse.json([]);
    }

    const safe = items.map((item: (typeof items)[number]) => {
      const highestBid = item.bids[0]?.amountPence ?? null;
      const bidCount = item.bids.length;

      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        pricePence: item.pricePence,
        highestBidPence: highestBid,
        bidCount,
        endsAt: item.endsAt ? item.endsAt.toISOString() : null,
        closed: item.closed,
      };
    });

    return NextResponse.json(safe);
  } catch (err) {
    console.error('[AUCTION_PUBLIC_ERROR]', err);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(err) : undefined,
      },
      { status: 500 }
    );
  }
}

// src/app/api/admin/auction/overview/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.auctionItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    if (!items.length) {
      return NextResponse.json([]);
    }

    const bids = await prisma.auctionBid.groupBy({
      where: {
        auctionItemId: { in: items.map((i: (typeof items)[number]) => i.id) },
      },
      by: ['auctionItemId'],
      _max: {
        amountPence: true,
        createdAt: true,
      },
      _count: {
        _all: true,
      },
    });

    const statsMap = new Map<
      string,
      {
        highestBidPence: number | null;
        bidCount: number;
        latestBidAt: Date | null;
      }
    >();

    for (const row of bids) {
      const auctionItemId = row.auctionItemId as string;
      statsMap.set(auctionItemId, {
        highestBidPence: row._max.amountPence ?? null,
        bidCount: row._count._all ?? 0,
        latestBidAt: row._max.createdAt ?? null,
      });
    }

    const safeItems = items.map((item: (typeof items)[number]) => {
      const stats = statsMap.get(item.id);
      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        pricePence: item.pricePence,
        active: item.active,
        closed: item.closed,
        sortOrder: item.sortOrder,
        endsAt: item.endsAt ? item.endsAt.toISOString() : null,
        createdAt: item.createdAt.toISOString(),
        highestBidPence: stats?.highestBidPence ?? null,
        bidCount: stats?.bidCount ?? 0,
        latestBidAt: stats?.latestBidAt ? stats.latestBidAt.toISOString() : null,
      };
    });

    return NextResponse.json(safeItems);
  } catch (err) {
    console.error('[ADMIN_AUCTION_OVERVIEW_ERROR]', err);
    return NextResponse.json({ error: 'Failed to load auction overview' }, { status: 500 });
  }
}

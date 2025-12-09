// src/app/auction/page.tsx
import { prisma } from '@/lib/prisma';
import AuctionClient from './AuctionClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AuctionPage() {
  const items = await prisma.auctionItem.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
  });

  if (items.length === 0) {
    return <AuctionClient items={[]} />;
  }

  // Highest bid + count for all auction items from AuctionBid
  const bids = await prisma.auctionBid.groupBy({
    where: {
      auctionItemId: { in: items.map((i: (typeof items)[number]) => i.id) },
    },
    by: ['auctionItemId'],
    _max: {
      amountPence: true,
    },
    _count: {
      _all: true,
    },
  });

  const statsMap = new Map<string, { highestBidPence: number | null; bidCount: number }>();

  for (const row of bids) {
    const auctionItemId = row.auctionItemId as string;
    statsMap.set(auctionItemId, {
      highestBidPence: row._max.amountPence ?? null,
      bidCount: row._count._all ?? 0,
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
      highestBidPence: stats?.highestBidPence ?? null,
      bidCount: stats?.bidCount ?? 0,
      endsAt: item.endsAt ? item.endsAt.toISOString() : null,
    };
  });

  return <AuctionClient items={safeItems} />;
}

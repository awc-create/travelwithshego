// src/app/auction/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AuctionItemClient from './AuctionItemClient';

type AuctionItemPageProps = {
  params: { slug: string };
};

export const dynamic = 'force-dynamic';

export default async function AuctionItemPage({ params }: AuctionItemPageProps) {
  const item = await prisma.auctionItem.findUnique({
    where: { slug: params.slug },
  });

  if (!item || !item.active) {
    notFound();
  }

  // Highest bid + bid count for this item from AuctionBid
  const highest = await prisma.auctionBid.aggregate({
    where: {
      auctionItemId: item.id,
    },
    _max: {
      amountPence: true,
    },
    _count: {
      _all: true,
    },
  });

  const safeItem = {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    pricePence: item.pricePence,
    highestBidPence: highest._max.amountPence ?? null,
    bidCount: highest._count._all ?? 0,
  };

  return <AuctionItemClient item={safeItem} />;
}

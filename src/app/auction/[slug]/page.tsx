// src/app/auction/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AuctionItemClient from './AuctionItemClient';

type AuctionItemPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AuctionItemPage({ params }: AuctionItemPageProps) {
  const { slug } = await params; // 👈 await because it's typed as a Promise

  const item = await prisma.auctionItem.findUnique({
    where: { slug },
  });

  if (!item || !item.active) {
    notFound();
  }

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

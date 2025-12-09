// src/app/auction/pay/[bid]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AuctionPayClient from '../AuctionPayClient';

type PayPageProps = {
  params: Promise<{ bid: string }>;
};

export default async function AuctionPayPage({ params }: PayPageProps) {
  // Next 15 types params as a Promise, so we await it
  const { bid } = await params;

  const bidRecord = await prisma.auctionBid.findUnique({
    where: { id: bid },
    include: { auctionItem: true },
  });

  if (!bidRecord || !bidRecord.auctionItem) {
    notFound();
  }

  const item = bidRecord.auctionItem;

  // Only allow payment once auction has ended
  if (!item.endsAt || item.endsAt.getTime() > Date.now()) {
    notFound();
  }

  // Only allow the marked winner to pay
  if (!bidRecord.isWinner) {
    notFound();
  }

  const safeItem = {
    bidId: bidRecord.id,
    title: item.title,
    amountPence: bidRecord.amountPence,
    slug: item.slug,
  };

  return <AuctionPayClient item={safeItem} />;
}

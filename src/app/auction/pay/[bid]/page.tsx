import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AuctionPayClient from '../AuctionPayClient';

type PayPageProps = {
  params: { bidId: string };
};

export const dynamic = 'force-dynamic';

export default async function AuctionPayPage({ params }: PayPageProps) {
  const { bidId } = params;

  const bid = await prisma.auctionBid.findUnique({
    where: { id: bidId },
    include: { auctionItem: true },
  });

  if (!bid || !bid.auctionItem) {
    notFound();
  }

  const item = bid.auctionItem;

  // Only allow payment once auction has ended
  if (!item.endsAt || item.endsAt.getTime() > Date.now()) {
    notFound();
  }

  // Only allow the marked winner to pay
  if (!bid.isWinner) {
    // Optional: show a nicer page here instead of 404
    notFound();
  }

  const safeItem = {
    bidId: bid.id,
    title: item.title,
    amountPence: bid.amountPence,
    slug: item.slug,
  };

  return <AuctionPayClient item={safeItem} />;
}

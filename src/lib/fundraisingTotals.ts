// src/lib/fundraisingTotals.ts
import { prisma } from '@/lib/prisma';

const FUNDRAISING_GOAL_PENCE = 10_000 * 100; // £10,000 – adjust if needed

export type FundraisingStats = {
  raisedPence: number;
  goalPence: number;
  directCount: number;
  auctionDonationCount: number;
  totalDonationsCount: number;
  totalBidsCount: number;
  averageGiftPence: number;
};

export async function getFundraisingTotals(): Promise<FundraisingStats> {
  // All *paid* donations
  const overallAgg = await prisma.donation.aggregate({
    where: { status: 'SUCCEEDED' },
    _sum: { amountPence: true },
    _avg: { amountPence: true },
    _count: { _all: true },
  });

  const [directCount, auctionDonationCount, bidsAgg] = await Promise.all([
    prisma.donation.count({
      where: { status: 'SUCCEEDED', type: 'DIRECT' },
    }),
    prisma.donation.count({
      where: { status: 'SUCCEEDED', type: 'AUCTION' },
    }),
    prisma.auctionBid.aggregate({
      _count: { _all: true },
    }),
  ]);

  const raisedPence = overallAgg._sum.amountPence ?? 0;
  const averageGiftPence = overallAgg._avg.amountPence ?? 0;
  const totalDonationsCount = overallAgg._count._all ?? 0;
  const totalBidsCount = bidsAgg._count._all ?? 0;

  return {
    raisedPence,
    goalPence: FUNDRAISING_GOAL_PENCE,
    directCount,
    auctionDonationCount,
    totalDonationsCount,
    totalBidsCount,
    averageGiftPence,
  };
}

// src/app/api/stats/donations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Treated as $10,000 goal in cents
  const GOAL_PENCE = 10_000 * 100;

  const [totalAgg, directCount, auctionDonationCount, totalDonationsCount, totalBidsCount] =
    await Promise.all([
      prisma.donation.aggregate({
        where: { status: 'SUCCEEDED' },
        _sum: { amountPence: true }, // "cents"
      }),
      prisma.donation.count({
        where: { status: 'SUCCEEDED', type: 'DIRECT' },
      }),
      prisma.donation.count({
        where: { status: 'SUCCEEDED', type: 'AUCTION' },
      }),
      prisma.donation.count({
        where: { status: 'SUCCEEDED' },
      }),
      prisma.auctionBid.count(),
    ]);

  const raisedPence = totalAgg._sum.amountPence ?? 0;
  const avgGift = totalDonationsCount > 0 ? Math.round(raisedPence / totalDonationsCount) : 0;

  return NextResponse.json({
    raisedPence,
    goalPence: GOAL_PENCE,
    directCount,
    auctionDonationCount,
    totalDonationsCount,
    totalBidsCount,
    averageGiftPence: avgGift,
  });
}

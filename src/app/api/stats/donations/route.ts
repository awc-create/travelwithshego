// src/app/api/stats/donations/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DonationStatus, DonationType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  // If you ever move goal into DB, swap this to a fetch.
  const GOAL_PENCE = 10_000 * 100; // £10,000

  const [totalAgg, directCount, auctionDonationCount, totalDonationsCount, totalBidsCount] =
    await Promise.all([
      prisma.donation.aggregate({
        where: { status: DonationStatus.SUCCEEDED },
        _sum: { amountPence: true },
      }),
      prisma.donation.count({
        where: { status: DonationStatus.SUCCEEDED, type: DonationType.DIRECT },
      }),
      prisma.donation.count({
        where: { status: DonationStatus.SUCCEEDED, type: DonationType.AUCTION },
      }),
      prisma.donation.count({
        where: { status: DonationStatus.SUCCEEDED },
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

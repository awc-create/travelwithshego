// src/app/api/admin/donations/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type DonationStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
type DonationType = 'DIRECT' | 'AUCTION';
type DonationFrequency = 'ONCE' | 'MONTHLY';

// Type we expect back from Prisma including the joined auctionItem
type DonationWithAuction = {
  id: string;
  createdAt: Date;
  amountPence: number; // stored as cents in DB
  currency: string;
  status: DonationStatus;
  type: DonationType;
  frequency: DonationFrequency | string;
  email: string;
  name: string | null;
  stripeCheckoutSessionId: string | null;
  stripeCustomerId: string | null;
  auctionItem: {
    title: string | null;
    slug: string | null;
  } | null;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const statusParam = searchParams.get('status');
    const typeParam = searchParams.get('type');
    const search = searchParams.get('search') ?? '';
    const limitParam = searchParams.get('limit');
    const fromParam = searchParams.get('from'); // yyyy-mm-dd
    const toParam = searchParams.get('to'); // yyyy-mm-dd
    const minAmountParam = searchParams.get('minCents'); // cents
    const maxAmountParam = searchParams.get('maxCents'); // cents

    // Build a plain JS object for where
    const where: Record<string, unknown> = {};

    // --- Status filter ---
    if (statusParam && ['PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED'].includes(statusParam)) {
      (where as { status?: DonationStatus }).status = statusParam as DonationStatus;
    }

    // --- Type filter ---
    if (typeParam && ['DIRECT', 'AUCTION'].includes(typeParam)) {
      (where as { type?: DonationType }).type = typeParam as DonationType;
    }

    // --- Date range filter ---
    if (fromParam || toParam) {
      const createdAtFilter: { gte?: Date; lte?: Date } = {};

      if (fromParam) {
        const fromDate = new Date(`${fromParam}T00:00:00.000Z`);
        if (!Number.isNaN(fromDate.getTime())) {
          createdAtFilter.gte = fromDate;
        }
      }

      if (toParam) {
        const toDate = new Date(`${toParam}T23:59:59.999Z`);
        if (!Number.isNaN(toDate.getTime())) {
          createdAtFilter.lte = toDate;
        }
      }

      if (createdAtFilter.gte || createdAtFilter.lte) {
        (where as { createdAt?: { gte?: Date; lte?: Date } }).createdAt = createdAtFilter;
      }
    }

    // --- Min / max amount (cents) ---
    if (minAmountParam || maxAmountParam) {
      const amountFilter: { gte?: number; lte?: number } = {};

      if (minAmountParam) {
        const val = Number.parseInt(minAmountParam, 10);
        if (Number.isFinite(val)) amountFilter.gte = val;
      }

      if (maxAmountParam) {
        const val = Number.parseInt(maxAmountParam, 10);
        if (Number.isFinite(val)) amountFilter.lte = val;
      }

      if (amountFilter.gte !== undefined || amountFilter.lte !== undefined) {
        (
          where as {
            amountPence?: { gte?: number; lte?: number };
          }
        ).amountPence = amountFilter;
      }
    }

    // --- Search across email / name / Stripe / auction title+slug ---
    if (search.trim()) {
      const term = search.trim();

      (where as { OR?: unknown[] }).OR = [
        { email: { contains: term, mode: 'insensitive' as const } },
        { name: { contains: term, mode: 'insensitive' as const } },
        {
          stripeCheckoutSessionId: {
            contains: term,
            mode: 'insensitive' as const,
          },
        },
        {
          stripeCustomerId: {
            contains: term,
            mode: 'insensitive' as const,
          },
        },
        {
          auctionItem: {
            OR: [
              { title: { contains: term, mode: 'insensitive' as const } },
              { slug: { contains: term, mode: 'insensitive' as const } },
            ],
          },
        },
      ];
    }

    const limit = (() => {
      const raw = limitParam ? Number.parseInt(limitParam, 10) : 200;
      if (!Number.isFinite(raw) || raw <= 0) return 200;
      if (raw > 2000) return 2000;
      return raw;
    })();

    const items = (await prisma.donation.findMany({
      where: where as never,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        auctionItem: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    })) as DonationWithAuction[];

    // Global stats (all time) – still in cents, but using amountPence
    const [totalCount, succeededCount, failedCount, pendingCount, refundedCount, totalSucceeded] =
      await Promise.all([
        prisma.donation.count(),
        prisma.donation.count({ where: { status: 'SUCCEEDED' } }),
        prisma.donation.count({ where: { status: 'FAILED' } }),
        prisma.donation.count({ where: { status: 'PENDING' } }),
        prisma.donation.count({ where: { status: 'REFUNDED' } }),
        prisma.donation.aggregate({
          where: { status: 'SUCCEEDED' },
          _sum: { amountPence: true },
        }),
      ]);

    const itemsPayload = items.map((d: DonationWithAuction) => ({
      id: d.id,
      createdAt: d.createdAt.toISOString(),
      // expose as amountCents to the frontend
      amountCents: d.amountPence,
      currency: d.currency,
      status: d.status,
      type: d.type,
      frequency: d.frequency,
      email: d.email,
      name: d.name,
      stripeCheckoutSessionId: d.stripeCheckoutSessionId,
      stripeCustomerId: d.stripeCustomerId,
      auctionItemTitle: d.auctionItem?.title ?? null,
      auctionItemSlug: d.auctionItem?.slug ?? null,
    }));

    return NextResponse.json({
      items: itemsPayload,
      stats: {
        totalCount,
        succeededCount,
        failedCount,
        pendingCount,
        refundedCount,
        totalSucceededAmountCents: totalSucceeded._sum.amountPence ?? 0,
      },
    });
  } catch (err) {
    console.error('[ADMIN_DONATIONS_GET_ERROR]', err);
    return new NextResponse('Failed to load donations.', { status: 500 });
  }
}

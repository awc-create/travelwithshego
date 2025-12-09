// src/app/api/auction/bid/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { auctionItemId, email, name, amountPence } = body as {
      auctionItemId?: string;
      email?: string;
      name?: string;
      amountPence?: number;
    };

    if (!auctionItemId || !email) {
      return NextResponse.json({ error: 'auctionItemId and email are required' }, { status: 400 });
    }

    if (typeof amountPence !== 'number' || !Number.isInteger(amountPence) || amountPence <= 0) {
      return NextResponse.json(
        { error: 'A valid bid amount (in pence) is required.' },
        { status: 400 }
      );
    }

    const item = await prisma.auctionItem.findUnique({
      where: { id: auctionItemId },
    });

    // No `closed` check here for now – just active + existence
    if (!item || !item.active) {
      return NextResponse.json({ error: 'Auction item not found or inactive.' }, { status: 404 });
    }

    // Enforce minimum = suggested starting amount
    if (amountPence < item.pricePence) {
      return NextResponse.json(
        {
          error: `Minimum amount for this item is £${(item.pricePence / 100).toFixed(2)}.`,
        },
        { status: 400 }
      );
    }

    // Enforce strictly higher than current highest bid
    const highest = await prisma.auctionBid.aggregate({
      where: { auctionItemId: item.id },
      _max: { amountPence: true },
    });

    if (highest._max.amountPence != null && amountPence <= highest._max.amountPence) {
      return NextResponse.json(
        {
          error: `Your bid must be higher than the current highest bid of £${(
            highest._max.amountPence / 100
          ).toFixed(2)}.`,
        },
        { status: 400 }
      );
    }

    const bid = await prisma.auctionBid.create({
      data: {
        auctionItemId: item.id,
        amountPence,
        email,
        name: name || null,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        bidId: bid.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[AUCTION_BID_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

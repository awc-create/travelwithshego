// src/app/api/checkout/auction/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
      return NextResponse.json({ error: 'A valid donation amount is required.' }, { status: 400 });
    }

    const item = await prisma.auctionItem.findUnique({
      where: { id: auctionItemId },
    });

    if (!item || !item.active) {
      return NextResponse.json({ error: 'Auction item not found or inactive' }, { status: 404 });
    }

    // ❗ Prevent bids after auction ends (if endsAt is set)
    if (item.endsAt && item.endsAt <= new Date()) {
      return NextResponse.json({ error: 'This auction has ended.' }, { status: 400 });
    }

    // Enforce at least the suggested starting amount
    if (amountPence < item.pricePence) {
      return NextResponse.json(
        {
          error: `Minimum amount for this item is £${(item.pricePence / 100).toFixed(2)}.`,
        },
        { status: 400 }
      );
    }

    // Also enforce strictly higher than current highest bid (only auction donations)
    const highest = await prisma.donation.aggregate({
      where: {
        auctionItemId: item.id,
        status: 'SUCCEEDED',
        type: 'AUCTION',
      },
      _max: {
        amountPence: true,
      },
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

    const origin = req.headers.get('origin') ?? process.env.APP_URL ?? 'http://localhost:3000';

    // 1) Create a pending Donation row with the chosen amount
    const donation = await prisma.donation.create({
      data: {
        amountPence,
        currency: 'GBP',
        status: 'PENDING',
        frequency: 'ONCE',
        type: 'AUCTION',
        email,
        name: name || null,
        auctionItemId: item.id,
      },
    });

    // 2) Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: amountPence,
            product_data: {
              name: item.title,
              images: item.imageUrl ? [item.imageUrl] : [],
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/auction/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/auction/${item.slug}?canceled=true`,
      customer_email: email,
      metadata: {
        donationId: donation.id,
        donationType: 'AUCTION',
        auctionItemId: item.id,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create Stripe Checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[CHECKOUT_AUCTION_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

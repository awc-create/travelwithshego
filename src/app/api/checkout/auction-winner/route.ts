import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { bidId } = body as { bidId?: string };

    if (!bidId) {
      return NextResponse.json({ error: 'bidId is required' }, { status: 400 });
    }

    const bid = await prisma.auctionBid.findUnique({
      where: { id: bidId },
      include: { auctionItem: true },
    });

    if (!bid || !bid.auctionItem) {
      return NextResponse.json(
        { error: 'Bid not found or has no associated item' },
        { status: 404 }
      );
    }

    const item = bid.auctionItem;

    if (!item.active) {
      return NextResponse.json({ error: 'Auction item is inactive' }, { status: 400 });
    }

    if (!item.endsAt || item.endsAt.getTime() > Date.now()) {
      return NextResponse.json({ error: 'Auction has not ended yet' }, { status: 400 });
    }

    if (!bid.isWinner) {
      return NextResponse.json(
        { error: 'This bid is not marked as the winning bid.' },
        { status: 400 }
      );
    }

    const origin = req.headers.get('origin') ?? process.env.APP_URL ?? 'http://localhost:3000';

    // Create a pending donation row
    const donation = await prisma.donation.create({
      data: {
        amountPence: bid.amountPence,
        currency: 'GBP',
        status: 'PENDING',
        frequency: 'ONCE',
        type: 'AUCTION',
        email: bid.email,
        name: bid.name || null,
        auctionItemId: item.id,
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: bid.amountPence,
            product_data: {
              name: `Winning bid – ${item.title}`,
              images: item.imageUrl ? [item.imageUrl] : [],
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/auction/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/auction/pay/${bid.id}?canceled=true`,
      customer_email: bid.email,
      metadata: {
        donationId: donation.id,
        donationType: 'AUCTION',
        auctionItemId: item.id,
        bidId: bid.id,
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
    console.error('[CHECKOUT_AUCTION_WINNER_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

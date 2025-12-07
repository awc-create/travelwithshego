// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!webhookSecret || !sig) {
    console.error('[STRIPE_WEBHOOK_CONFIG_ERROR]');
    return new NextResponse('Webhook configuration error', { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[STRIPE_WEBHOOK_SIGNATURE_ERROR]', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const kind = session.metadata?.kind;

        if (kind === 'AUCTION_WINNER') {
          const auctionItemId = session.metadata?.auctionItemId;
          const auctionBidId = session.metadata?.auctionBidId;

          if (!auctionItemId || !auctionBidId) {
            break;
          }

          const amountPence = session.amount_total ?? 0;
          const currency = (session.currency ?? 'gbp').toUpperCase();
          const email = session.customer_email ?? session.metadata?.email ?? 'unknown@example.com';
          const name = session.customer_details?.name ?? session.metadata?.name ?? null;

          // idempotency: avoid double-creating donations for same checkout
          const existing = await prisma.donation.findFirst({
            where: { stripeCheckoutSessionId: session.id },
          });

          if (!existing) {
            await prisma.donation.create({
              data: {
                amountPence,
                currency,
                status: 'SUCCEEDED',
                frequency: 'ONCE',
                type: 'AUCTION',
                email,
                name,
                auctionItemId,
                stripeCheckoutSessionId: session.id,
                stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
              },
            });
          }
        }

        break;
      }

      default:
        // You can log or ignore other events for now
        break;
    }

    return new NextResponse('ok', { status: 200 });
  } catch (err) {
    console.error('[STRIPE_WEBHOOK_HANDLER_ERROR]', err);
    return new NextResponse('Webhook handler error', { status: 500 });
  }
}

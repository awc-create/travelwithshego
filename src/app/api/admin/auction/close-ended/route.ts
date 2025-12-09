// src/app/api/admin/auction/close-ended/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

// Simple shared secret so only you/cron can call this route
const ADMIN_AUCTION_TOKEN = process.env.ADMIN_AUCTION_TOKEN;

/**
 * Helper to send an email to the winning bidder.
 * Plug this into Resend / Postmark / SES / nodemailer later.
 */
type WinnerEmailPayload = {
  to: string;
  name: string | null;
  itemTitle: string;
  amountPence: number;
  payUrl: string;
};

async function sendAuctionWinnerEmail(payload: WinnerEmailPayload) {
  // TODO: replace with your real email integration
  // e.g. Resend:
  // await resend.emails.send({ to: payload.to, subject: ..., react: <Template ... /> });
  console.log('[AUCTION_WINNER_EMAIL]', payload);
}

/**
 * POST /api/admin/auction/close-ended
 * Body or header must contain the admin token.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const tokenFromHeader = authHeader?.replace('Bearer ', '');
    const body = (await req.json().catch(() => null)) as { token?: string } | null;
    const tokenFromBody = body?.token;

    const token = tokenFromHeader || tokenFromBody;

    if (!ADMIN_AUCTION_TOKEN || token !== ADMIN_AUCTION_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find all items that have ended but are not yet closed
    const items = await prisma.auctionItem.findMany({
      where: {
        active: true,
        closed: false,
        endsAt: {
          not: null,
          lte: now,
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    if (!items.length) {
      return NextResponse.json({ message: 'No ended auctions to close.' });
    }

    const origin = req.headers.get('origin') ?? process.env.APP_URL ?? 'http://localhost:3000';

    const results: Array<{
      itemId: string;
      itemTitle: string;
      closed: boolean;
      winnerEmail?: string;
      amountPence?: number;
      error?: string;
    }> = [];

    for (const item of items) {
      try {
        // Fetch bids sorted by highest amount, then earliest time
        const bids = await prisma.auctionBid.findMany({
          where: { auctionItemId: item.id },
          orderBy: [{ amountPence: 'desc' }, { createdAt: 'asc' }],
        });

        if (!bids.length) {
          // No bids at all: just close the item
          await prisma.auctionItem.update({
            where: { id: item.id },
            data: {
              closed: true,
              active: false,
            },
          });

          results.push({
            itemId: item.id,
            itemTitle: item.title,
            closed: true,
          });
          continue;
        }

        const winner = bids[0];

        // Mark item as closed + inactive
        await prisma.auctionItem.update({
          where: { id: item.id },
          data: {
            closed: true,
            active: false,
          },
        });

        // Reset all isWinner flags then set this one as winner
        await prisma.auctionBid.updateMany({
          where: { auctionItemId: item.id },
          data: { isWinner: false },
        });

        await prisma.auctionBid.update({
          where: { id: winner.id },
          data: { isWinner: true },
        });

        // Create Stripe checkout for the winner
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'gbp',
                unit_amount: winner.amountPence,
                product_data: {
                  name: item.title,
                  description: `Winning bid for "${item.title}"`,
                  images: item.imageUrl ? [item.imageUrl] : [],
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${origin}/auction/${item.slug}?payment=success`,
          cancel_url: `${origin}/auction/${item.slug}?payment=canceled`,
          customer_email: winner.email,
          metadata: {
            kind: 'AUCTION_WINNER',
            auctionBidId: winner.id,
            auctionItemId: item.id,
            email: winner.email,
            name: winner.name ?? '',
          },
        });

        if (!session.url) {
          throw new Error('Stripe session missing URL');
        }

        // Send email with link to pay
        await sendAuctionWinnerEmail({
          to: winner.email,
          name: winner.name ?? null,
          itemTitle: item.title,
          amountPence: winner.amountPence,
          payUrl: session.url,
        });

        results.push({
          itemId: item.id,
          itemTitle: item.title,
          closed: true,
          winnerEmail: winner.email,
          amountPence: winner.amountPence,
        });
      } catch (err) {
        console.error('[CLOSE_AUCTION_ITEM_ERROR]', item.id, err);
        results.push({
          itemId: item.id,
          itemTitle: item.title,
          closed: false,
          error: (err as Error).message,
        });
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error('[CLOSE_AUCTION_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

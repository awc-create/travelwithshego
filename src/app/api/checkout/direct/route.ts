// src/app/api/checkout/direct/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Frequency = 'once' | 'monthly';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { amountPence, email, name, frequency } = body as {
      amountPence?: number;
      email?: string;
      name?: string;
      frequency?: Frequency;
    };

    if (!email || !amountPence) {
      return NextResponse.json({ error: 'Email and amount are required.' }, { status: 400 });
    }

    if (typeof amountPence !== 'number' || !Number.isInteger(amountPence) || amountPence <= 0) {
      return NextResponse.json({ error: 'A valid donation amount is required.' }, { status: 400 });
    }

    const freq: Frequency = frequency === 'monthly' ? 'monthly' : 'once';

    const origin = req.headers.get('origin') ?? process.env.APP_URL ?? 'http://localhost:3000';

    // 1) Create pending Donation row
    const donation = await prisma.donation.create({
      data: {
        amountPence,
        currency: 'GBP',
        status: 'PENDING',
        frequency: freq === 'monthly' ? 'MONTHLY' : 'ONCE',
        type: 'DIRECT',
        email,
        name: name || null,
      },
    });

    // 2) Create Stripe Checkout session
    // For now, even "monthly" is still a one-off payment; frequency is stored for your records.
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: amountPence,
            product_data: {
              name:
                freq === 'monthly'
                  ? 'Monthly donation to support Baraawe'
                  : 'Direct donation to support Baraawe',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donation?canceled=true`,
      customer_email: email,
      metadata: {
        donationId: donation.id,
        donationType: 'DIRECT',
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create Stripe Checkout session.' },
        { status: 500 }
      );
    }

    // Optionally store checkout session id
    await prisma.donation.update({
      where: { id: donation.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[CHECKOUT_DIRECT_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

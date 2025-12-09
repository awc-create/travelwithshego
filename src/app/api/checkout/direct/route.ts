// src/app/api/checkout/direct/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

type Frequency = 'once' | 'monthly';

type DirectCheckoutBody = {
  amountPence?: number | string; // treated as USD *cents*
  amountCents?: number | string; // alias – also cents
  amount?: number | string; // treated as USD *dollars* (or free-text like "25.50")
  email?: string;
  name?: string;
  message?: string;
  frequency?: Frequency;
};

// ---- Simple helpers -----------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

type RateEntry = {
  count: number;
  firstRequestTime: number;
};

const rateLimitStore = new Map<string, RateEntry>();

function getClientKey(req: NextRequest): string {
  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp && xRealIp.trim().length > 0) return xRealIp.trim();

  const xff = req.headers.get('x-forwarded-for');
  if (xff && xff.length > 0) return xff.split(',')[0].trim();

  return 'unknown';
}

function isRateLimited(req: NextRequest): boolean {
  const key = getClientKey(req);
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry) {
    rateLimitStore.set(key, { count: 1, firstRequestTime: now });
    return false;
  }

  const elapsed = now - entry.firstRequestTime;

  if (elapsed > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(key, { count: 1, firstRequestTime: now });
    return false;
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);

  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

type LogContext = {
  endpoint: string;
  error: unknown;
  email?: string;
  amountCents?: number;
  donationId?: string;
  stripeSessionId?: string;
};

function logError(context: LogContext) {
  console.error('[CHECKOUT_DIRECT_ERROR]', context);
}

// Parse "amount" (dollars) into integer USD cents
function parseAmountToCents(raw: unknown): number | null {
  if (raw == null) return null;

  if (typeof raw === 'number') {
    if (!Number.isFinite(raw) || raw <= 0) return null;
    return Math.round(raw * 100); // dollars → cents
  }

  if (typeof raw === 'string') {
    const cleaned = raw.replace(/[^0-9.,]/g, '').replace(/,/g, '.');

    if (!cleaned) return null;

    const parsed = Number(cleaned);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;

    return Math.round(parsed * 100); // dollars → cents
  }

  return null;
}

function isValidEmail(email: string | undefined): email is string {
  if (!email) return false;
  return /\S+@\S+\.\S+/.test(email);
}

// ---- Route handler ------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(req)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const bodyTyped = body as DirectCheckoutBody;

    const email = bodyTyped.email;
    const name = bodyTyped.name;
    const message = bodyTyped.message;
    const freqRaw = bodyTyped.frequency;

    // If amountPence / amountCents present → already cents.
    // Else use `amount` (dollars) and parse.
    let amountCents: number | null = null;

    const centsRaw = bodyTyped.amountPence ?? bodyTyped.amountCents;

    if (centsRaw != null) {
      const num = typeof centsRaw === 'string' ? Number(centsRaw) : centsRaw;
      if (typeof num === 'number' && Number.isFinite(num) && num > 0) {
        amountCents = Math.round(num); // treat as cents
      }
    } else {
      amountCents = parseAmountToCents(bodyTyped.amount);
    }

    if (!isValidEmail(email) || amountCents === null) {
      return NextResponse.json(
        { error: 'Email and a valid donation amount are required.' },
        { status: 400 }
      );
    }

    // 🧱 Stripe-level constraint: at least 50 cents equivalent.
    if (amountCents < 50) {
      return NextResponse.json(
        { error: 'The minimum card Donation we can process is $0.50.' },
        { status: 400 }
      );
    }

    // Optional upper bound
    if (amountCents > 10_000 * 100) {
      return NextResponse.json(
        { error: 'For gifts above $10,000 please contact us directly.' },
        { status: 400 }
      );
    }

    const freq: Frequency = freqRaw === 'monthly' ? 'monthly' : 'once';

    const origin = req.headers.get('origin') ?? process.env.APP_URL ?? 'http://localhost:3000';

    // 1) Create pending Donation row (field still called amountPence but stores cents)
    const donation = await prisma.donation.create({
      data: {
        amountPence: amountCents,
        currency: 'USD',
        status: 'PENDING',
        frequency: freq === 'monthly' ? 'MONTHLY' : 'ONCE',
        type: 'DIRECT',
        email,
        name: name || null,
      },
    });

    const idempotencyKey = `checkout_direct_${donation.id}`;

    // 2) Create Stripe Checkout session
    let session;

    if (freq === 'monthly') {
      session = await stripe.checkout.sessions.create(
        {
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                unit_amount: amountCents,
                recurring: { interval: 'month' },
                product_data: {
                  name: 'Monthly donation to support Baraawe',
                  description:
                    'Recurring monthly donation to support shelter, education and care for children and families in Baraawe.',
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
            frequency: freq,
            message: message ?? '',
          },
          subscription_data: {
            metadata: {
              donationId: donation.id,
              donationType: 'DIRECT',
              frequency: freq,
            },
          },
        },
        { idempotencyKey }
      );
    } else {
      session = await stripe.checkout.sessions.create(
        {
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                unit_amount: amountCents,
                product_data: {
                  name: 'Direct donation to support Baraawe',
                  description:
                    'Donation to support shelter, education and care for children and families in Baraawe.',
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
            frequency: freq,
            message: message ?? '',
          },
        },
        { idempotencyKey }
      );
    }

    if (!session.url) {
      logError({
        endpoint: '/api/checkout/direct',
        error: new Error('Stripe session returned without URL'),
        email,
        amountCents,
        donationId: donation.id,
      });

      return NextResponse.json(
        { error: 'Failed to create Stripe Checkout session.' },
        { status: 500 }
      );
    }

    // 3) Store checkout session id for reconciliation
    await prisma.donation.update({
      where: { id: donation.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    // Handle Stripe "amount too small" gracefully if we ever hit it
    const code =
      typeof error === 'object' && error && 'code' in error
        ? (error as { code?: string }).code
        : undefined;

    if (code === 'amount_too_small') {
      return NextResponse.json(
        { error: 'Stripe requires a minimum charge of $0.50. Please increase your amount.' },
        { status: 400 }
      );
    }

    logError({
      endpoint: '/api/checkout/direct',
      error,
    });

    return NextResponse.json(
      { error: 'Something went wrong starting the secure checkout.' },
      { status: 500 }
    );
  }
}

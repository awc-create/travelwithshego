// src/app/api/webhook/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import {
  sendDonationReceiptEmail,
  sendDonationFailedEmail,
  type DonationRecord,
} from '@/lib/email/donations';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Narrow internal DB shape we care about (so we don't need Prisma's Donation type)
type DonationDbRecord = {
  id: string;
  amountPence: number;
  currency: string;
  status: DonationRecord['status']; // 👈 was: string
  frequency: string;
  type: DonationRecord['type']; // 👈 was: string
  email: string;
  name: string | null;
  createdAt: Date;
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
};

function toDonationRecord(d: DonationDbRecord): DonationRecord {
  return {
    id: d.id,
    amountPence: d.amountPence,
    currency: d.currency,
    status: d.status,
    frequency: d.frequency,
    type: d.type,
    email: d.email,
    name: d.name,
    createdAt: d.createdAt,
    stripePaymentIntentId: d.stripePaymentIntentId,
    stripeCheckoutSessionId: d.stripeCheckoutSessionId,
  };
}

// Extend Invoice locally with the fields the new Stripe types are hiding / unioning
type InvoiceWithExtras = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null;
  payment_intent?: string | Stripe.PaymentIntent | null;
  last_payment_error?: { message?: string } | null;
};

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
      // =========================================================
      // 1) CHECKOUT SESSION COMPLETED
      //    - Auction winners
      //    - Direct donations (one-off + first monthly charge)
      // =========================================================
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata ?? {};

        const kind = metadata.kind;
        const donationType = metadata.donationType;
        const paymentStatus = session.payment_status; // 'paid' | 'unpaid' | 'no_payment_required'

        // -----------------------------------
        // 🟡 AUCTION WINNER FLOW
        // -----------------------------------
        if (kind === 'AUCTION_WINNER') {
          const auctionItemId = metadata.auctionItemId;
          const auctionBidId = metadata.auctionBidId;

          if (!auctionItemId || !auctionBidId) {
            console.error('[STRIPE_WEBHOOK_AUCTION_MISSING_META]', {
              auctionItemId,
              auctionBidId,
            });
            break;
          }

          const amountPence = session.amount_total ?? 0;
          const currency = (session.currency ?? 'usd').toUpperCase();
          const email = session.customer_email ?? metadata.email ?? 'unknown@example.com';
          const name = session.customer_details?.name ?? metadata.name ?? null;

          // idempotency: avoid double-creating donations for same checkout
          const existing = await prisma.donation.findFirst({
            where: { stripeCheckoutSessionId: session.id },
          });

          if (!existing) {
            await prisma.donation.create({
              data: {
                amountPence,
                currency,
                status: paymentStatus === 'paid' ? 'SUCCEEDED' : 'FAILED',
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

          break;
        }

        // -----------------------------------
        // 🟢 DIRECT DONATION FLOW
        //    (one-off + first monthly charge)
        // -----------------------------------
        if (donationType === 'DIRECT') {
          const donationIdFromMetadata = metadata.donationId ?? undefined;
          const stripeSessionId = session.id;
          const amountTotalCents = session.amount_total ?? null;

          // Prefer the explicit donationId if present
          const donation =
            donationIdFromMetadata != null
              ? await prisma.donation.findUnique({
                  where: { id: donationIdFromMetadata },
                })
              : await prisma.donation.findFirst({
                  where: { stripeCheckoutSessionId: stripeSessionId },
                });

          if (!donation) {
            console.error('[STRIPE_WEBHOOK_DIRECT_NOT_FOUND]', {
              donationIdFromMetadata,
              stripeSessionId,
            });
            break;
          }

          // If already marked SUCCEEDED / FAILED, don’t touch it
          if (donation.status === 'SUCCEEDED' || donation.status === 'FAILED') {
            break;
          }

          const stripeCustomerId =
            typeof session.customer === 'string' ? session.customer : donation.stripeCustomerId;

          const currency = (session.currency ?? donation.currency ?? 'usd').toUpperCase();

          const amountPence = amountTotalCents != null ? amountTotalCents : donation.amountPence;

          const isSubscription = session.mode === 'subscription';
          const stripeReference =
            typeof session.payment_intent === 'string' ? session.payment_intent : stripeSessionId;

          if (paymentStatus === 'paid') {
            const updated = await prisma.donation.update({
              where: { id: donation.id },
              data: {
                status: 'SUCCEEDED',
                amountPence,
                currency,
                stripeCheckoutSessionId: stripeSessionId,
                stripeCustomerId,
              },
            });

            // 🔔 Send receipt + thank-you for:
            // - One-off donations
            // - First successful monthly donation (subscription_create)
            await sendDonationReceiptEmail({
              donation: toDonationRecord(updated as DonationDbRecord),
              stripeReference,
              isRecurringCharge: isSubscription,
            });
          } else if (paymentStatus === 'unpaid') {
            const updated = await prisma.donation.update({
              where: { id: donation.id },
              data: {
                status: 'FAILED',
                stripeCheckoutSessionId: stripeSessionId,
                stripeCustomerId,
              },
            });

            // 🔔 Send failure email (card declined / payment not captured)
            await sendDonationFailedEmail({
              donation: toDonationRecord(updated as DonationDbRecord),
              reason: 'Your card was not charged and the payment could not be completed.',
            });
          }

          break;
        }

        // ------------------------------
        // Other / unknown sessions
        // ------------------------------
        break;
      }

      // =========================================================
      // 2) INVOICE PAYMENT SUCCEEDED (MONTHLY RENEWALS)
      //    - We only handle recurring cycles here, not the
      //      initial subscription_create to avoid duplicate emails.
      // =========================================================
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as InvoiceWithExtras;

        // Only handle subscription cycle renewals, not the initial charge
        if (invoice.billing_reason && invoice.billing_reason !== 'subscription_cycle') {
          break;
        }

        const invoiceMetadata = invoice.metadata ?? {};
        let donationId = invoiceMetadata.donationId as string | undefined;
        let donationTypeMeta = invoiceMetadata.donationType as string | undefined;

        // If donationId not on invoice, try subscription metadata
        if (!donationId && invoice.subscription && typeof invoice.subscription === 'string') {
          try {
            const sub = await stripe.subscriptions.retrieve(invoice.subscription);
            const subMeta = sub.metadata ?? {};
            donationId = subMeta.donationId as string | undefined;
            donationTypeMeta = (subMeta.donationType as string | undefined) ?? donationTypeMeta;
          } catch (err) {
            console.error('[STRIPE_WEBHOOK_SUBSCRIPTION_FETCH_ERROR]', err);
          }
        }

        if (donationTypeMeta !== 'DIRECT' || !donationId) {
          // Not one of our direct monthly donations
          break;
        }

        const donation = await prisma.donation.findUnique({
          where: { id: donationId },
        });

        if (!donation) {
          console.error('[STRIPE_WEBHOOK_INVOICE_DONATION_NOT_FOUND]', {
            donationId,
          });
          break;
        }

        const amountPence = invoice.amount_paid ?? donation.amountPence;
        const currency = (invoice.currency ?? donation.currency ?? 'usd').toUpperCase();

        const stripePaymentIntentId =
          typeof invoice.payment_intent === 'string'
            ? invoice.payment_intent
            : donation.stripePaymentIntentId;

        const stripeCustomerId =
          typeof invoice.customer === 'string' ? invoice.customer : donation.stripeCustomerId;

        const updated = await prisma.donation.update({
          where: { id: donation.id },
          data: {
            amountPence,
            currency,
            status: 'SUCCEEDED',
            stripePaymentIntentId,
            stripeCustomerId,
          },
        });

        const stripeReference =
          typeof invoice.payment_intent === 'string' ? invoice.payment_intent : invoice.id;

        // 🔔 Monthly renewal receipt + thank-you
        await sendDonationReceiptEmail({
          donation: toDonationRecord(updated as DonationDbRecord),
          stripeReference,
          isRecurringCharge: true,
        });

        break;
      }

      // =========================================================
      // 3) INVOICE PAYMENT FAILED (MONTHLY RENEWALS)
      // =========================================================
      case 'invoice.payment_failed': {
        const invoice = event.data.object as InvoiceWithExtras;

        // Again, focus on subscription cycles; avoid duplication with initial checkout
        if (invoice.billing_reason && invoice.billing_reason !== 'subscription_cycle') {
          break;
        }

        const invoiceMetadata = invoice.metadata ?? {};
        let donationId = invoiceMetadata.donationId as string | undefined;
        let donationTypeMeta = invoiceMetadata.donationType as string | undefined;

        if (!donationId && invoice.subscription && typeof invoice.subscription === 'string') {
          try {
            const sub = await stripe.subscriptions.retrieve(invoice.subscription);
            const subMeta = sub.metadata ?? {};
            donationId = subMeta.donationId as string | undefined;
            donationTypeMeta = (subMeta.donationType as string | undefined) ?? donationTypeMeta;
          } catch (err) {
            console.error('[STRIPE_WEBHOOK_SUBSCRIPTION_FETCH_ERROR_FAILED]', err);
          }
        }

        if (donationTypeMeta !== 'DIRECT' || !donationId) {
          break;
        }

        const donation = await prisma.donation.findUnique({
          where: { id: donationId },
        });

        if (!donation) {
          console.error('[STRIPE_WEBHOOK_INVOICE_DONATION_NOT_FOUND_FAILED]', {
            donationId,
          });
          break;
        }

        const stripePaymentIntentId =
          typeof invoice.payment_intent === 'string'
            ? invoice.payment_intent
            : donation.stripePaymentIntentId;

        const stripeCustomerId =
          typeof invoice.customer === 'string' ? invoice.customer : donation.stripeCustomerId;

        const updated = await prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: 'FAILED',
            stripePaymentIntentId,
            stripeCustomerId,
          },
        });

        const reason =
          invoice.last_payment_error?.message ??
          'Your latest monthly donation payment could not be completed.';

        // 🔔 Monthly payment failed email
        await sendDonationFailedEmail({
          donation: toDonationRecord(updated as DonationDbRecord),
          reason,
        });

        break;
      }

      // =========================================================
      // Default: ignore other events for now
      // =========================================================
      default:
        break;
    }

    return new NextResponse('ok', { status: 200 });
  } catch (err) {
    console.error('[STRIPE_WEBHOOK_HANDLER_ERROR]', err);
    return new NextResponse('Webhook handler error', { status: 500 });
  }
}

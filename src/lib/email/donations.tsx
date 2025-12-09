// src/lib/email/donations.tsx
import React from 'react';
import { resend, RESEND_ENABLED, RESEND_FROM } from '@/lib/resend';
import { DonationReceiptEmail } from '@/emails/DonationReceiptEmail';
import { DonationFailedEmail } from '@/emails/DonationFailedEmail';

// We only need the fields used in the emails.
// This avoids importing types from @prisma/client.
export type DonationRecord = {
  id: string;
  amountPence: number;
  currency: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
  frequency: string; // e.g. 'MONTHLY' | 'ONCE' (we'll treat 'MONTHLY' specially)
  type: 'DIRECT' | 'AUCTION';
  email: string;
  name: string | null;
  createdAt: Date;
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
};

const FROM = RESEND_FROM || 'Travel With Shego <no-reply@travelwithshego.com>';

export async function sendDonationReceiptEmail(options: {
  donation: DonationRecord;
  stripeReference?: string;
  isRecurringCharge?: boolean;
}) {
  const { donation, stripeReference, isRecurringCharge = false } = options;

  if (!donation.email) return;

  if (!RESEND_ENABLED || !resend) {
    console.error(
      '[RESEND_DISABLED] Donation receipt email NOT sent (missing RESEND_API_KEY or Resend client).'
    );
    return;
  }

  const isMonthly = donation.frequency === 'MONTHLY';

  await resend.emails.send({
    from: FROM,
    to: donation.email,
    subject: isMonthly
      ? isRecurringCharge
        ? 'Thank you for your monthly Donation'
        : 'Welcome – your monthly Donation is set up'
      : 'Thank you for your Donation',
    react: (
      <DonationReceiptEmail
        donorName={donation.name}
        amountCents={donation.amountPence}
        currency={donation.currency}
        frequency={isMonthly ? 'MONTHLY' : 'ONCE'}
        createdAt={donation.createdAt}
        reference={
          stripeReference ||
          donation.stripePaymentIntentId ||
          donation.stripeCheckoutSessionId ||
          donation.id
        }
        isRecurringCharge={isRecurringCharge}
      />
    ),
  });
}

export async function sendDonationFailedEmail(options: {
  donation: DonationRecord;
  reason?: string;
}) {
  const { donation, reason } = options;

  if (!donation.email) return;

  if (!RESEND_ENABLED || !resend) {
    console.error(
      '[RESEND_DISABLED] Donation failed email NOT sent (missing RESEND_API_KEY or Resend client).'
    );
    return;
  }

  const isMonthly = donation.frequency === 'MONTHLY';

  await resend.emails.send({
    from: FROM,
    to: donation.email,
    subject: isMonthly
      ? 'Your monthly Donation payment failed'
      : 'Your Donation payment did not go through',
    react: (
      <DonationFailedEmail
        donorName={donation.name}
        amountCents={donation.amountPence}
        currency={donation.currency}
        frequency={isMonthly ? 'MONTHLY' : 'ONCE'}
        reason={reason}
      />
    ),
  });
}

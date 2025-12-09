// src/app/donation/success/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

type DonationSuccessPageProps = {
  // Next 15: searchParams comes in as a Promise
  searchParams: Promise<{ session_id?: string; demo?: string } | undefined>;
};

const fmtUsd = (cents: number | null | undefined): string => {
  const value = (cents ?? 0) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
};

type RenderProps = {
  displayName: string;
  amountCents: number;
  email?: string;
  finalStatus: 'paid' | 'pending' | 'no_payment_required';
};

function renderThankYou({ displayName, amountCents, email, finalStatus }: RenderProps) {
  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          background: '#fffdf7',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '1.9rem',
            marginBottom: '0.75rem',
          }}
        >
          Thank you, {displayName}.
        </h1>

        {finalStatus === 'paid' && (
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Your Donation of <strong>{fmtUsd(amountCents)}</strong> has been received. You&apos;re
            helping us provide shelter, education and daily care for families in Baraawe.
          </p>
        )}

        {finalStatus === 'pending' && (
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            We&apos;ve received your details and your payment is still being processed. If you
            don&apos;t see a confirmation email within a few minutes, please contact us with the
            same email you used at checkout.
          </p>
        )}

        {finalStatus === 'no_payment_required' && (
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Your details have been recorded. This session didn&apos;t require a charge, but your
            support helps us keep the project moving.
          </p>
        )}

        {email && (
          <p
            style={{
              marginBottom: '1.25rem',
              fontSize: '0.95rem',
              color: '#6b6b6b',
            }}
          >
            A confirmation email has been sent to <strong>{email}</strong>.
          </p>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginTop: '0.5rem',
          }}
        >
          <Link
            href="/donation"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.25rem',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #f5d487, #d8a34d)',
              color: '#111',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Back to Donation page
          </Link>

          <Link
            href="/"
            style={{
              fontSize: '0.9rem',
              color: '#6b6b6b',
              textDecoration: 'underline',
            }}
          >
            Return to home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default async function DonationSuccessPage({ searchParams }: DonationSuccessPageProps) {
  const params = await searchParams; // 👈 await the Promise
  const sessionId = params?.session_id;
  const demo = params?.demo === 'true';

  // 🔹 DEMO MODE: /donation/success?demo=true
  if (demo) {
    return renderThankYou({
      displayName: 'Adnan',
      amountCents: 50 * 100, // $50.00
      email: 'demo@example.com',
      finalStatus: 'paid',
    });
  }

  // If no session id and not demo, just send them back to donation page
  if (!sessionId) {
    redirect('/donation');
  }

  // 1) Fetch Stripe Checkout Session
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent', 'customer_details'],
  });

  if (!session) {
    redirect('/donation');
  }

  const paymentStatus = session.payment_status;
  const amountTotalCents = session.amount_total ?? 0;
  const email = session.customer_details?.email ?? undefined;
  const customerName = session.customer_details?.name ?? undefined;

  // 2) Look up the associated donation using the stored Stripe session id
  const donation = await prisma.donation.findFirst({
    where: { stripeCheckoutSessionId: session.id },
  });

  if (donation) {
    // 3) If this is the first time we hit success for a paid session, mark it as SUCCEEDED
    if (paymentStatus === 'paid' && donation.status === 'PENDING') {
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: 'SUCCEEDED',
        },
      });
    }
  }

  const effectiveAmountCents = donation?.amountPence ?? amountTotalCents;
  const displayName = donation?.name || customerName || 'Friend';

  const finalStatus =
    paymentStatus === 'paid'
      ? 'paid'
      : paymentStatus === 'no_payment_required'
        ? 'no_payment_required'
        : 'pending';

  return renderThankYou({
    displayName,
    amountCents: effectiveAmountCents,
    email,
    finalStatus,
  });
}

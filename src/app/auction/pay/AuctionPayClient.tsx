'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './AuctionPay.module.scss';

type PayItemDTO = {
  bidId: string;
  title: string;
  amountPence: number;
  slug: string;
};

type Props = {
  item: PayItemDTO;
};

export default function AuctionPayClient({ item }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = item.amountPence / 100;

  async function handlePay() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout/auction-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId: item.bidId }),
      });

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;

      if (!res.ok || !data?.url) {
        setError(data?.error || 'Unable to start checkout. Please try again or contact support.');
        setIsSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error('[AUCTION_WINNER_PAY_CLIENT_ERROR]', err);
      setError('Unexpected error. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <p className={styles.kicker}>Auction payment</p>
            <h1 className={styles.title}>Complete your winning bid</h1>

            <p className={styles.lead}>
              Thank you for supporting the Baraawe initiative. You&apos;re about to complete payment
              for:
            </p>

            <div className={styles.summary}>
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.amount}>
                Winning amount: <strong>£{amount.toFixed(2)}</strong>
              </p>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="button"
              className={styles.primaryButton}
              onClick={handlePay}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Redirecting to secure checkout…' : 'Pay securely with card'}
            </button>

            <p className={styles.secondary}>
              If this link was sent to you in error, please ignore it or{' '}
              <Link href="/contact">contact us</Link>.
            </p>
          </div>

          <div className={styles.backRow}>
            <Link href="/auction" className={styles.backLink}>
              ← Back to auction
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

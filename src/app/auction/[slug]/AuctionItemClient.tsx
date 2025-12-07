// src/app/auction/[slug]/AuctionItemClient.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './AuctionItem.module.scss';

type AuctionItemDTO = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  pricePence: number; // suggested / minimum
  highestBidPence: number | null;
  bidCount: number;
};

type Props = {
  item: AuctionItemDTO;
};

export default function AuctionItemClient({ item }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<string>((item.pricePence / 100).toFixed(2));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const suggested = item.pricePence / 100;
  const highestBid = item.highestBidPence != null ? item.highestBidPence / 100 : null;

  async function handleBid(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setSuccess(null);

    if (!email) {
      setError('Please enter your email so we can contact you if you win.');
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (numericAmount < suggested) {
      setError(`Minimum amount for this item is £${suggested.toFixed(2)}.`);
      return;
    }

    if (highestBid != null && numericAmount <= highestBid) {
      setError(
        `Your bid must be higher than the current highest bid of £${highestBid.toFixed(2)}.`
      );
      return;
    }

    const amountPence = Math.round(numericAmount * 100);

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auction/bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auctionItemId: item.id,
          email,
          name: name || undefined,
          amountPence,
        }),
      });

      const data = (await res.json().catch(() => null)) as { error?: string; ok?: boolean } | null;

      if (!res.ok || !data?.ok) {
        const message = data?.error || 'Something went wrong placing your bid. Please try again.';
        setError(message);
        setIsSubmitting(false);
        return;
      }

      setSuccess(
        'Your bid has been placed. If you win at the end of the auction, you will receive an email with a secure payment link.'
      );
      // Keep email so they don’t have to re-type, but reset only amount & name
      setName('');
      setAmount(suggested.toFixed(2));
      setIsSubmitting(false);
    } catch (err) {
      console.error('[AUCTION_BID_ERROR]', err);
      setError('Unexpected error. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.layout}>
            <div className={styles.media}>
              {item.imageUrl && (
                <div className={styles.imageFrame}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={800}
                    height={540}
                    className={styles.image}
                  />
                </div>
              )}
            </div>

            <div className={styles.content}>
              <p className={styles.kicker}>Auction item</p>
              <h1 className={styles.title}>{item.title}</h1>

              <p className={styles.lead}>{item.description}</p>

              <div className={styles.panel}>
                <p className={styles.label}>Suggested starting amount</p>
                <p className={styles.amount}>£{suggested.toFixed(2)}</p>
                <p className={styles.note}>
                  Your contribution helps fund teaching, resources, and support for children in
                  Baraawe.
                </p>

                {/* Current highest bid */}
                <p className={styles.note}>
                  {highestBid != null ? (
                    <>
                      Current highest bid: <strong>£{highestBid.toFixed(2)}</strong>{' '}
                      {item.bidCount > 1 && <span>({item.bidCount} bids so far)</span>}
                    </>
                  ) : (
                    <>No bids yet – be the first to support this item.</>
                  )}
                </p>

                <form onSubmit={handleBid} className={styles.form}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="amount">
                      Your bid amount (GBP)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      min={suggested.toFixed(2)}
                      step="0.01"
                      className={styles.input}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={suggested.toFixed(2)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="name">
                      Name (optional)
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={styles.input}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="email">
                      Email for follow-up
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>

                  {error && <p className={styles.error}>{error}</p>}
                  {success && <p className={styles.success}>{success}</p>}

                  <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Placing your bid…' : 'Place bid'}
                  </button>
                </form>

                <p className={styles.secondary}>
                  Prefer a direct donation? <Link href="/donation">Visit the donation page</Link>.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.backRow}>
            <Link href="/auction" className={styles.backLink}>
              ← Back to all auction items
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

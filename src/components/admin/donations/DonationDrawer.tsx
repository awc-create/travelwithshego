// src/components/admin/donations/DonationDrawer.tsx
'use client';

import { useState } from 'react';
import styles from './DonationSettings.module.scss';
import type { DonationRow } from './DonationSettings';
import { DonationTimeline } from './DonationTimeline';

type DonationDrawerProps = {
  donation: DonationRow | null;
  onClose: () => void;
};

function formatMoneyUSD(cents: number | null | undefined): string {
  const value = (cents ?? 0) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function DonationDrawer({ donation, onClose }: DonationDrawerProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  if (!donation) return null;

  const isSucceeded = donation.status === 'SUCCEEDED';
  const isPending = donation.status === 'PENDING';
  const isFailed = donation.status === 'FAILED';
  const isRefunded = donation.status === 'REFUNDED';

  async function handleResendReceipt() {
    if (!donation) return;

    if (!donation.email) {
      setResendError('This donation has no email address.');
      setResendSuccess(null);
      return;
    }

    setIsResending(true);
    setResendError(null);
    setResendSuccess(null);

    try {
      const res = await fetch('/api/admin/donations/resend-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationId: donation.id }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || data.error) {
        setResendError(data.error || 'Failed to resend receipt.');
        setResendSuccess(null);
        return;
      }

      setResendSuccess('Receipt email resent successfully.');
      setResendError(null);
    } catch (err) {
      console.error('[RESEND_RECEIPT_BUTTON_ERROR]', err);
      setResendError('Failed to resend receipt. Please try again.');
      setResendSuccess(null);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <aside
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
        aria-label="Donation details"
      >
        <header className={styles.drawerHeader}>
          <div>
            <h3>Donation details</h3>
            <p>
              {formatMoneyUSD(donation.amountCents)} ·{' '}
              {donation.type === 'DIRECT' ? 'Direct donation' : 'Auction donation'}
            </p>
          </div>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={onClose}
            aria-label="Close donation details"
          >
            ✕
          </button>
        </header>

        <div className={styles.drawerContent}>
          <div className={styles.drawerBadges}>
            <span
              className={`${styles.badge} ${
                isSucceeded
                  ? styles.badgeSuccess
                  : isPending
                    ? styles.badgePending
                    : isFailed
                      ? styles.badgeFailed
                      : isRefunded
                        ? styles.badgeRefunded
                        : styles.badgeDefault
              }`}
            >
              {donation.status}
            </span>

            <span
              className={`${styles.chip} ${
                donation.type === 'DIRECT' ? styles.chipDirect : styles.chipAuction
              }`}
            >
              {donation.type}
            </span>

            <span className={styles.freqChip}>
              {donation.frequency === 'MONTHLY' ? 'Monthly' : 'One-off'}
            </span>
          </div>

          {/* Donor info */}
          <section className={styles.drawerSection}>
            <h4>Donor</h4>
            <dl className={styles.infoList}>
              <div>
                <dt>Name</dt>
                <dd>{donation.name || 'Anonymous'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{donation.email}</dd>
              </div>
              <div>
                <dt>Auction item</dt>
                <dd>{donation.auctionItemTitle ?? '—'}</dd>
              </div>
            </dl>
          </section>

          {/* Stripe info */}
          <section className={styles.drawerSection}>
            <h4>Stripe</h4>
            <dl className={styles.infoList}>
              <div>
                <dt>Checkout session ID</dt>
                <dd>{donation.stripeCheckoutSessionId ?? '—'}</dd>
              </div>
              <div>
                <dt>Customer ID</dt>
                <dd>{donation.stripeCustomerId ?? '—'}</dd>
              </div>
              <div>
                <dt>Currency</dt>
                <dd>{donation.currency}</dd>
              </div>
            </dl>
          </section>

          {/* Resend receipt (only for SUCCEEDED) */}
          {isSucceeded && (
            <section className={`${styles.drawerSection} ${styles.receiptSection}`}>
              <div className={styles.drawerSectionHeaderRow}>
                <div>
                  <h4>Receipt email</h4>
                  <p className={styles.drawerSectionCaption}>
                    Use this if the donor says they never received their receipt or deleted it.
                  </p>
                </div>
                <span className={styles.sectionTag}>EMAIL</span>
              </div>

              <div className={styles.drawerMetaRow}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Send to</span>
                  <span className={styles.metaValue}>{donation.email}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Status</span>
                  <span className={styles.metaValue}>
                    {isResending ? 'Sending…' : 'Ready to resend'}
                  </span>
                </div>
              </div>

              <div className={styles.drawerActionsRow}>
                <button
                  type="button"
                  className={styles.primaryButtonWide}
                  onClick={handleResendReceipt}
                  disabled={isResending || !donation.email}
                  aria-label={
                    donation.email
                      ? `Resend donation receipt to ${donation.email}`
                      : 'Cannot resend receipt: no email on record'
                  }
                >
                  {isResending ? 'Resending receipt…' : 'Resend receipt'}
                </button>
              </div>

              {resendError && (
                <p className={styles.inlineError} role="status">
                  {resendError}
                </p>
              )}
              {resendSuccess && (
                <p className={styles.inlineSuccess} role="status">
                  {resendSuccess}
                </p>
              )}
            </section>
          )}

          {/* Timeline */}
          <DonationTimeline donation={donation} />
        </div>
      </aside>
    </div>
  );
}

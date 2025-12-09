'use client';

import styles from './DonationSettings.module.scss';
import type { DonationRow } from './DonationSettings';

type DonationTableProps = {
  items: DonationRow[];
  onRowClick: (donation: DonationRow) => void;
};

function formatMoneyUSD(cents: number): string {
  const value = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function copyEmail(email: string) {
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(email);
  } else {
    window.prompt('Copy email address:', email);
  }
}

function openStripeSession(sessionId: string | null) {
  if (!sessionId) return;
  const url = `https://dashboard.stripe.com/search?query=${encodeURIComponent(sessionId)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function openAuctionPage(slug: string | null) {
  if (!slug) return;
  const url = `/auction/${slug}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function DonationTable({ items, onRowClick }: DonationTableProps) {
  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Type</th>
            <th>Frequency</th>
            <th>Donor</th>
            <th>Email</th>
            <th>Auction item</th>
            <th>Stripe session</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => {
            const isSucceeded = d.status === 'SUCCEEDED';
            const isPending = d.status === 'PENDING';
            const isFailed = d.status === 'FAILED';
            const isRefunded = d.status === 'REFUNDED';

            return (
              <tr key={d.id} className={styles.row} onClick={() => onRowClick(d)}>
                <td>{formatDate(d.createdAt)}</td>

                {/* Amount */}
                <td>
                  <div className={styles.amountCell}>
                    <span className={styles.amountMain}>{formatMoneyUSD(d.amountCents)}</span>
                    <span className={styles.amountSub}>{d.currency}</span>
                  </div>
                </td>

                {/* Status */}
                <td>
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
                    {d.status}
                  </span>
                </td>

                {/* Type */}
                <td>
                  <span
                    className={`${styles.chip} ${
                      d.type === 'DIRECT' ? styles.chipDirect : styles.chipAuction
                    }`}
                  >
                    {d.type}
                  </span>
                </td>

                {/* Frequency */}
                <td>
                  <span className={styles.freq}>
                    {d.frequency === 'MONTHLY' ? 'Monthly' : 'One-off'}
                  </span>
                </td>

                {/* Donor */}
                <td>
                  <div className={styles.donorCell}>
                    <span className={styles.donorName}>{d.name || 'Anonymous'}</span>
                  </div>
                </td>

                {/* Email */}
                <td>{d.email}</td>

                {/* Auction item */}
                <td>{d.auctionItemTitle ?? '—'}</td>

                {/* Stripe session */}
                <td>
                  {d.stripeCheckoutSessionId ? (
                    <code className={styles.sessionCode}>{d.stripeCheckoutSessionId}</code>
                  ) : (
                    '—'
                  )}
                </td>

                {/* ACTION BUTTONS */}
                <td>
                  <div className={styles.rowActions}>
                    {/* COPY EMAIL - WITH ACCESSIBILITY LABEL */}
                    <button
                      type="button"
                      className={styles.smallButton}
                      aria-label={`Copy donor email ${d.email}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyEmail(d.email);
                      }}
                    >
                      Copy email
                    </button>

                    {/* STRIPE SESSION - WITH ACCESSIBILITY LABEL */}
                    <button
                      type="button"
                      className={styles.smallButtonGhost}
                      disabled={!d.stripeCheckoutSessionId}
                      aria-label={
                        d.stripeCheckoutSessionId
                          ? `Open Stripe session ${d.stripeCheckoutSessionId}`
                          : 'Stripe session unavailable'
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        openStripeSession(d.stripeCheckoutSessionId);
                      }}
                    >
                      Stripe
                    </button>

                    {/* AUCTION ITEM (ONLY IF APPLICABLE) */}
                    {d.type === 'AUCTION' && d.auctionItemSlug && (
                      <button
                        type="button"
                        className={styles.smallButtonGhost}
                        aria-label={`View auction item page for ${d.auctionItemSlug}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openAuctionPage(d.auctionItemSlug);
                        }}
                      >
                        View item
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

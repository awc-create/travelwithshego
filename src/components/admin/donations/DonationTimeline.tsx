// src/components/admin/donations/DonationTimeline.tsx
'use client';

import styles from './DonationSettings.module.scss';
import type { DonationRow } from './DonationSettings';

type TimelineKind = 'created' | 'status' | 'stripe';

type TimelineEvent = {
  kind: TimelineKind;
  label: string;
  description?: string;
  at: string | null;
};

type DonationTimelineProps = {
  donation: DonationRow;
};

function formatDateShort(iso: string | null): string {
  if (!iso) return '—';
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

function buildTimeline(d: DonationRow): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  events.push({
    kind: 'created',
    label: 'Donation created',
    description: 'Initial record created when checkout began.',
    at: d.createdAt,
  });

  if (d.stripeCheckoutSessionId) {
    events.push({
      kind: 'stripe',
      label: 'Stripe Checkout session',
      description: `Session ID: ${d.stripeCheckoutSessionId}`,
      at: d.createdAt,
    });
  }

  if (d.status === 'SUCCEEDED') {
    events.push({
      kind: 'status',
      label: 'Payment succeeded',
      description:
        'Marked as SUCCEEDED via Stripe webhook or success page. Funds should have cleared.',
      at: d.createdAt,
    });
  } else if (d.status === 'PENDING') {
    events.push({
      kind: 'status',
      label: 'Awaiting confirmation',
      description: 'Still PENDING – waiting on Stripe confirmation, webhook, or manual review.',
      at: null,
    });
  } else if (d.status === 'FAILED') {
    events.push({
      kind: 'status',
      label: 'Payment failed',
      description: 'Marked as FAILED. Card may have been declined or cancelled.',
      at: null,
    });
  } else if (d.status === 'REFUNDED') {
    events.push({
      kind: 'status',
      label: 'Payment refunded',
      description: 'Marked as REFUNDED. Funds should be returned to the donor.',
      at: null,
    });
  }

  return events;
}

export function DonationTimeline({ donation }: DonationTimelineProps) {
  const events = buildTimeline(donation);

  return (
    <section className={styles.drawerSection}>
      <h4>Timeline</h4>
      <ol className={styles.timeline}>
        {events.map((event) => (
          <li key={`${event.kind}-${event.label}`} className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineBody}>
              <div className={styles.timelineHeader}>
                <span className={styles.timelineLabel}>{event.label}</span>
                <span className={styles.timelineTime}>
                  {event.at ? formatDateShort(event.at) : '—'}
                </span>
              </div>
              {event.description && <p className={styles.timelineDesc}>{event.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

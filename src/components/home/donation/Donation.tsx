'use client';

import Link from 'next/link';
import styles from './Donation.module.scss';

type DonationProps = {
  donateHref: string;
  contactHref?: string;
  contactLabel?: string;
  raised: number;
  goal: number;
  title?: string;
  subtitle?: string;
};

export default function Donation({
  donateHref,
  contactHref = '/contact',
  contactLabel = 'Questions? Contact us',
  raised,
  goal,
  title = 'Give Shelter & Hope',
  subtitle = 'Your gift provides safe shelter, education and care in Baraawe.',
}: DonationProps) {
  const pct = Math.max(0, Math.min(100, Math.round((raised / Math.max(goal, 1)) * 100)));

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })
      .format(n)
      .replace('.00', '');

  return (
    <section className={styles.block} aria-label="Donate">
      <div className={styles.card}>
        <header className={styles.head}>
          <h2>{title}</h2>
          <p className={styles.note}>{subtitle}</p>
        </header>

        {/* progress */}
        <div
          className={styles.progress}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label={`Raised ${fmt(raised)} of ${fmt(goal)} (${pct}%)`}
        >
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>

        {/* meta */}
        <div className={styles.meta}>
          <span className={styles.raised}>{fmt(raised)} raised</span>
          <span className={styles.goal}>
            <span className={styles.goalLabel}>Goal</span> {fmt(goal)}
          </span>
        </div>

        {/* actions */}
        <div className={styles.actions}>
          <Link href={donateHref} className={styles.cta} aria-label="Donate now">
            Donate Now
          </Link>

          {contactHref && (
            <Link href={contactHref} className={styles.secondary}>
              {contactLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// src/components/home/donation/Donation.tsx
'use client';

import Link from 'next/link';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import styles from './Donation.module.scss';

type DonationProps = {
  donateHref: string;
  contactHref?: string;
  contactLabel?: string;
  raised: number; // dollars
  goal: number; // dollars
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
  const animRaised = useAnimatedNumber(raised);
  const animGoal = useAnimatedNumber(goal);
  const pct = animGoal > 0 ? Math.min(100, Math.round((animRaised / animGoal) * 100)) : 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })
      .format(Math.round(n))
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
          aria-label={`Raised ${fmt(animRaised)} of ${fmt(animGoal)} (${pct}%)`}
        >
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>

        {/* meta */}
        <div className={styles.meta}>
          <span className={styles.raised}>{fmt(animRaised)} raised</span>
          <span className={styles.goal}>
            <span className={styles.goalLabel}>Goal</span> {fmt(animGoal)}
          </span>
        </div>

        {/* actions unchanged */}
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

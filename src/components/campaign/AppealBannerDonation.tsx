'use client';

import { APPEAL_PILLARS } from '@/lib/appeal/appeals';
import { useAppeal } from '@/hooks/useAppeal';
import styles from './AppealBannerDonation.module.scss';

type AppealBannerDonationProps = {
  paypalUrl: string | null;
};

export default function AppealBannerDonation({ paypalUrl }: AppealBannerDonationProps) {
  const appeal = useAppeal();

  if (!paypalUrl) return null;

  return (
    <section className={styles.wrap} aria-label={appeal.ariaLabel}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>{appeal.eyebrow}</p>
        <h2 className={styles.title}>{appeal.title}</h2>
        <p className={styles.body}>{appeal.body}</p>

        <ul className={styles.pillars} aria-label="What your gift builds">
          {APPEAL_PILLARS.map((pillar) => (
            <li key={pillar.amount} className={styles.pillar}>
              <span className={styles.pillarAmount}>{pillar.amount}</span>
              <span className={styles.pillarCopy}>
                <strong className={styles.pillarTitle}>{pillar.title}</strong>
                <span className={styles.pillarNote}>{pillar.note}</span>
              </span>
            </li>
          ))}
        </ul>

        <a href={paypalUrl} target="_blank" rel="noreferrer" className={styles.cta}>
          {appeal.ctaLabel}
        </a>

        <p className={styles.note}>
          Everyone is welcome to give — of every faith and none. Prefer a general donation instead?
          You can still use the standard donation form on this page.
        </p>
      </div>
    </section>
  );
}

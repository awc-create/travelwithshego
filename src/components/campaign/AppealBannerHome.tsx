'use client';

import Link from 'next/link';
import { APPEAL_PILLARS } from '@/lib/appeal/appeals';
import { useAppeal } from '@/hooks/useAppeal';
import styles from './AppealBannerHome.module.scss';

type AppealBannerHomeProps = {
  paypalUrl?: string | null;
};

export default function AppealBannerHome({ paypalUrl }: AppealBannerHomeProps) {
  const appeal = useAppeal();

  // Fallback: if we somehow don't have a special URL, send them to /donation
  const href = paypalUrl || '/donation';

  return (
    <section className={styles.banner} aria-label={appeal.ariaLabel}>
      <div className={styles.inner}>
        <div className={styles.textBlock}>
          <p className={styles.pill}>{appeal.eyebrow}</p>
          <h2 className={styles.title}>{appeal.title}</h2>
          <p className={styles.body}>{appeal.body}</p>

          <ul className={styles.pillars} aria-label="What your gift builds">
            {APPEAL_PILLARS.map((pillar) => (
              <li key={pillar.amount} className={styles.pillar}>
                <span className={styles.pillarAmount}>{pillar.amount}</span>
                <span className={styles.pillarTitle}>{pillar.title}</span>
              </li>
            ))}
          </ul>

          <div className={styles.ctaRow}>
            <Link href={href} className={styles.buttonPrimary} target="_blank">
              {appeal.ctaLabel}
            </Link>

            <Link href="/donation#how-it-works" className={styles.linkSecondary}>
              How your donation is used
            </Link>
          </div>
        </div>

        <div className={styles.statBlock}>
          <p className={styles.statLabel}>{appeal.focusLabel}</p>
          <p className={styles.statMain}>{appeal.focusMain}</p>
          <p className={styles.statNote}>{appeal.focusNote}</p>
          <p className={styles.statAll}>Open to everyone, of every faith and none.</p>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import styles from './RamadanBannerHome.module.scss';

type RamadanHomeBannerProps = {
  paypalUrl?: string | null;
};

export default function RamadanHomeBanner({ paypalUrl }: RamadanHomeBannerProps) {
  // Fallback: if we somehow don't have a special URL, send them to /donation
  const href = paypalUrl || '/donation';

  return (
    <section className={styles.banner} aria-label="Ramadan 2026 appeal">
      <div className={styles.inner}>
        <div className={styles.textBlock}>
          <p className={styles.pill}>Ramadan Mubarak • 2026 Special Appeal</p>
          <h2 className={styles.title}>Share Iftar &amp; Hope this Ramadan.</h2>
          <p className={styles.body}>
            Ramadan Mubarak. This Ramadan, we&apos;re raising a dedicated fund for food packs, iftar
            meals, and essentials for families in Baraawe. Every donation helps a family sit down to
            a meal they may not have had otherwise.
          </p>

          <div className={styles.ctaRow}>
            <Link href={href} className={styles.buttonPrimary} target="_blank">
              Give to the Ramadan Fund
            </Link>

            <Link href="/donation#how-it-works" className={styles.linkSecondary}>
              How your donation is used
            </Link>
          </div>
        </div>

        <div className={styles.statBlock}>
          <p className={styles.statLabel}>Ramadan focus</p>
          <p className={styles.statMain}>Food packs &amp; iftar meals</p>
          <p className={styles.statNote}>
            100% of your Ramadan gift goes towards food support on the ground in Baraawe.
          </p>
        </div>
      </div>
    </section>
  );
}

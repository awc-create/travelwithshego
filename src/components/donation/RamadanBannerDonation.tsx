'use client';

import styles from './RamadanBannerDonation.module.scss';

type RamadanBannerDonationProps = {
  paypalUrl: string | null;
};

export default function RamadanBannerDonation({ paypalUrl }: RamadanBannerDonationProps) {
  if (!paypalUrl) return null;

  return (
    <section className={styles.wrap} aria-label="Ramadan 2026 special campaign">
      <div className={styles.card}>
        <p className={styles.eyebrow}>Special Campaign · Ramadan 2026</p>
        <h2 className={styles.title}>Turn your Donation into a Ramadan meal.</h2>
        <p className={styles.body}>
          Donations made through our Ramadan campaign link go directly towards iftar meals, food
          parcels, and practical support for families in Baraawe. If you&apos;d like your gift to
          count towards Ramadan meals, please use the dedicated Ramadan button below.
        </p>
        <a href={paypalUrl} target="_blank" rel="noreferrer" className={styles.cta}>
          Give to the Ramadan Fund
        </a>
        <p className={styles.note}>
          Prefer a general Donation instead? You can still use the standard Donation form on this
          page.
        </p>
      </div>
    </section>
  );
}

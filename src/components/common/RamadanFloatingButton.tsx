'use client';

import styles from './RamadanFloatingButton.module.scss';

type RamadanFloatingButtonProps = {
  paypalUrl: string | null;
};

export default function RamadanFloatingButton({ paypalUrl }: RamadanFloatingButtonProps) {
  if (!paypalUrl) return null;

  return (
    <button type="button" className={styles.fabWrapper}>
      <a
        href={paypalUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.fab}
        aria-label="Open Ramadan 2026 donation link – help provide iftar meals for families in Baraawe."
      >
        <span className={styles.dot} />
        <span className={styles.labelDesktop}>Ramadan 2026 · Give a Meal</span>
        <span className={styles.labelMobile}>Ramadan 2026</span>
      </a>
    </button>
  );
}

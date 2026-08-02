'use client';

import { useAppeal } from '@/hooks/useAppeal';
import styles from './AppealFloatingButton.module.scss';

type AppealFloatingButtonProps = {
  paypalUrl: string | null;
};

export default function AppealFloatingButton({ paypalUrl }: AppealFloatingButtonProps) {
  const appeal = useAppeal();

  if (!paypalUrl) return null;

  return (
    <div className={styles.fabWrapper}>
      <a
        href={paypalUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.fab}
        aria-label={appeal.ariaLabel}
      >
        <span className={styles.dot} />
        <span className={styles.labelDesktop}>{appeal.fabDesktop}</span>
        <span className={styles.labelMobile}>{appeal.fabMobile}</span>
      </a>
    </div>
  );
}

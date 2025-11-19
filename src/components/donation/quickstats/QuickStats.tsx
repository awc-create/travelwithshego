'use client';

import styles from './QuickStats.module.scss';

export const quickStatsMetadata = {
  title: 'Donation Impact Stats – Travel with Shego',
  description:
    'See the real-time impact of your Donation: families supported, children in school, meals provided, and more.',
};

type StatProps = {
  label: string;
  value: string | number;
};

function Stat({ label, value }: StatProps) {
  return (
    <div className={styles.stat}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default function QuickStats() {
  // Eventually these will come from DB / API
  const stats = [
    { label: 'Families Supported', value: '12' },
    { label: 'Children in School', value: '48' },
    { label: 'Meals Served', value: '7,200+' },
    { label: 'Monthly Donors', value: '34' },
    { label: 'Total Raised', value: '£3,400' },
  ];

  return (
    <section
      className={styles.wrap}
      aria-labelledby="quick-stats-heading"
      aria-describedby="quick-stats-desc"
    >
      <div className={styles.inner}>
        <h2 id="quick-stats-heading" className={styles.heading}>
          Your <span className={styles.gold}>Donation</span> in Numbers
        </h2>

        <p id="quick-stats-desc" className={styles.sub}>
          Transparent, real-time updates showing how your support is changing lives in Baraawe.
        </p>

        <div className={styles.grid}>
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </div>
    </section>
  );
}

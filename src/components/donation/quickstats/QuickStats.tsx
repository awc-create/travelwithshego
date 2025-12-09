// src/components/donation/quickstats/QuickStats.tsx
'use client';

import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import type { DonationStats } from '@/hooks/useDonationStats';
import styles from './QuickStats.module.scss';

export const quickStatsMetadata = {
  title: 'Donation Impact Stats – Travel with Shego',
  description:
    'See the real-time impact of your Donation: families supported, children in school, meals provided, and more.',
};

type StatCard = {
  label: string;
  value: string;
  highlight?: boolean;
};

type QuickStatsProps = {
  stats: DonationStats | null;
  loading: boolean;
};

type StatProps = StatCard;

function Stat({ label, value, highlight }: StatProps) {
  return (
    <div className={`${styles.stat} ${highlight ? styles.statHighlight : ''}`}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

// pence == cents now (1/100 of USD)
const fmtMoney = (pence: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
    .format(pence / 100)
    .replace('.00', '');

const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US').toString();

export default function QuickStats({ stats, loading }: QuickStatsProps) {
  const base = stats ?? {
    raisedPence: 3_400 * 100,
    goalPence: 10_000 * 100,
    directCount: 0,
    auctionDonationCount: 0,
    totalDonationsCount: 0,
    totalBidsCount: 0,
    averageGiftPence: 0,
  };

  const animRaised = useAnimatedNumber(base.raisedPence);
  const animGoal = useAnimatedNumber(base.goalPence);
  const animDirect = useAnimatedNumber(base.directCount);
  const animAuctionDonations = useAnimatedNumber(base.auctionDonationCount);
  const animTotalDonations = useAnimatedNumber(base.totalDonationsCount);
  const animTotalBids = useAnimatedNumber(base.totalBidsCount);
  const animAvgGift = useAnimatedNumber(base.averageGiftPence);

  const cards: StatCard[] = [
    {
      label: 'Total Raised',
      value: fmtMoney(animRaised),
      highlight: true,
    },
    {
      label: 'Funding Goal',
      value: fmtMoney(animGoal),
    },
    {
      label: 'Direct Donations',
      value: fmtInt(animDirect),
    },
    {
      label: 'Auction Contributions',
      value: fmtInt(animAuctionDonations),
    },
    {
      label: 'Total Donations',
      value: fmtInt(animTotalDonations),
    },
    {
      label: 'Bids Placed',
      value: fmtInt(animTotalBids),
    },
    {
      label: 'Average Gift',
      value: fmtMoney(animAvgGift || 0),
    },
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
          {loading && !stats ? (
            <>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className={`${styles.stat} ${styles.skeleton}`} />
              ))}
            </>
          ) : (
            cards.map((card) => (
              <Stat
                key={card.label}
                label={card.label}
                value={card.value}
                highlight={card.highlight}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

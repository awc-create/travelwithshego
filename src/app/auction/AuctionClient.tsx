// src/app/auction/AuctionClient.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './Auction.module.scss';

type AuctionItemDTO = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  pricePence: number;
  highestBidPence: number | null;
  bidCount: number;
  endsAt: string | null;
};

type TimerState = 'normal' | 'soon' | 'ended';

function formatRemaining(ms: number): string {
  if (ms <= 0) return 'Auction ended';

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

  if (days > 0) return `Ends in ${days}d ${hours}h`;
  if (hours > 0) return `Ends in ${hours}h ${minutes}m`;
  return `Ends in ${minutes}m`;
}

function useCountdown(endsAt: string | null): {
  label: string | null;
  state: TimerState;
} {
  const [label, setLabel] = useState<string | null>(null);
  const [state, setState] = useState<TimerState>('normal');

  useEffect(() => {
    if (!endsAt) return;

    const target = new Date(endsAt).getTime();
    if (Number.isNaN(target)) return;

    function update() {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setLabel('Auction ended');
        setState('ended');
        return;
      }

      setLabel(formatRemaining(diff));
      if (diff < 24 * 60 * 60 * 1000) {
        setState('soon');
      } else {
        setState('normal');
      }
    }

    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [endsAt]);

  return { label, state };
}

function AuctionCard({ item }: { item: AuctionItemDTO }) {
  const suggested = item.pricePence / 100;
  const highest = item.highestBidPence != null ? item.highestBidPence / 100 : null;

  const { label: timerLabel, state: timerState } = useCountdown(item.endsAt);
  const timerClass =
    timerState === 'soon'
      ? `${styles.timer} ${styles.timerSoon}`
      : timerState === 'ended'
        ? `${styles.timer} ${styles.timerEnded}`
        : styles.timer;

  // skeleton + fade-in control
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article className={styles.card}>
      {/* Always render wrapper so skeleton is visible even without an image yet */}
      <div className={styles.imageWrap}>
        {/* If there's no image OR it's still loading → show shimmer */}
        {(!item.imageUrl || !imgLoaded) && <div className={styles.skeleton} />}

        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`${styles.image} ${imgLoaded ? styles.imageVisible : ''}`}
            onLoadingComplete={() => setImgLoaded(true)}
          />
        )}
      </div>

      <div className={styles.body}>
        {/* Head: title + description (fixed height for alignment) */}
        <div className={styles.head}>
          <h2 className={styles.cardTitle}>{item.title}</h2>
          <p className={styles.desc}>{item.description}</p>
        </div>

        {/* Suggested amount */}
        <p className={styles.price}>
          Suggested starting amount from <strong>£{suggested.toFixed(2)}</strong>
        </p>

        {/* Meta row: chips left, timer right */}
        <div className={styles.metaRow}>
          <div className={styles.metaLeft}>
            {highest != null ? (
              <span className={styles.chip}>Highest bid £{highest.toFixed(2)}</span>
            ) : (
              <span className={`${styles.chip} ${styles.chipEmpty}`}>No bids yet</span>
            )}

            {item.bidCount > 0 && (
              <span className={styles.chipSecondary}>
                {item.bidCount} bid{item.bidCount === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {item.endsAt && timerLabel && <span className={timerClass}>{timerLabel}</span>}
        </div>

        {/* Button pinned to bottom */}
        <div className={styles.buttonRow}>
          <Link href={`/auction/${item.slug}`} className={styles.button}>
            View item
          </Link>
        </div>
      </div>
    </article>
  );
}

type AuctionClientProps = {
  items: AuctionItemDTO[];
};

export default function AuctionClient({ items }: AuctionClientProps) {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <p className={styles.kicker}>Auction</p>
            <h1 className={styles.title}>Support Baraawe through unique items</h1>
            <p className={styles.lead}>
              Choose a fundraising item, make a donation, and directly support the Baraawe teaching
              initiative.
            </p>
          </header>

          {items.length === 0 ? (
            <p className={styles.empty}>Auction items are coming soon. Please check back later.</p>
          ) : (
            <div className={styles.grid}>
              {items.map((item) => (
                <AuctionCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

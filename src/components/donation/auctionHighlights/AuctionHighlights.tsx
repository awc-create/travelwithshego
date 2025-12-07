// src/components/donation/auctionHighlights/AuctionHighlights.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AuctionHighlights.module.scss';

export const auctionHighlightsMetadata = {
  title: 'Top Donation Auction Items – Quick Bids',
  description:
    'Browse featured items available for bidding. Win items you love while supporting children and families in Baraawe.',
};

type PublicAuctionItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  pricePence: number;
  highestBidPence: number | null;
  bidCount: number;
  endsAt: string | null;
  closed: boolean;
  active: boolean; // 👈 added so TS is happy when we filter on it
};

function fmtMoney(pence: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  })
    .format(pence / 100)
    .replace('.00', '');
}

function formatTimeLeft(iso: string | null): string {
  if (!iso) return 'No end date set';

  const now = Date.now();
  const end = new Date(iso).getTime();
  const diffMs = end - now;

  if (diffMs <= 0) return 'Ended';

  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {
    const mins = Math.round(diffMs / (1000 * 60));
    return `${mins} min${mins === 1 ? '' : 's'}`;
  }

  if (diffHours < 24) {
    const hrs = Math.round(diffHours);
    return `${hrs} hour${hrs === 1 ? '' : 's'}`;
  }

  const days = Math.round(diffHours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
}

export default function AuctionHighlights() {
  const [items, setItems] = useState<PublicAuctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/auction/public');
        if (!res.ok) {
          throw new Error(`Failed to load auction items (${res.status})`);
        }
        const data = (await res.json()) as PublicAuctionItem[];

        if (cancelled) return;

        // Filter active + not closed, sort by soonest end, take top 3
        const active = data.filter((i) => i.active && !i.closed);
        const sorted = [...active].sort((a, b) => {
          if (!a.endsAt && !b.endsAt) return 0;
          if (!a.endsAt) return 1;
          if (!b.endsAt) return -1;
          return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
        });

        setItems(sorted.slice(0, 3));
      } catch (err) {
        console.error('[AUCTION_HIGHLIGHTS_ERROR]', err);
        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveItems = items;

  return (
    <section
      id="auction-highlights"
      className={styles.wrap}
      aria-labelledby="auction-highlights-heading"
    >
      <div className={styles.inner}>
        <div className={styles.lead}>
          <span className={styles.kicker}>Quick Bids</span>

          <h2 id="auction-highlights-heading" className={styles.heading}>
            Featured <span className={styles.gold}>Auction</span> Items
          </h2>

          <p className={styles.sub}>
            Bid on quality-checked tech and electronics. If you win, your Donation supports vital
            projects in Baraawe.
          </p>
        </div>

        {/* skeleton while loading */}
        {loading && (
          <div className={styles.grid}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className={`${styles.card} ${styles.skeleton}`} />
            ))}
          </div>
        )}

        {!loading && effectiveItems.length > 0 && (
          <div className={styles.grid}>
            {effectiveItems.map((item) => {
              const currentPence =
                item.highestBidPence != null ? item.highestBidPence : item.pricePence;

              return (
                <Link key={item.id} href={`/auction/${item.slug}`} className={styles.card}>
                  <div className={styles.imgWrap}>
                    <Image
                      src={item.imageUrl || '/images/donation/sample/placeholder.jpg'}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 350px"
                      className={styles.img}
                    />
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>

                    <div className={styles.meta}>
                      <span className={styles.bid}>
                        Current Bid: <strong>{fmtMoney(currentPence)}</strong>
                      </span>
                      <span className={styles.timer}>Ends in {formatTimeLeft(item.endsAt)}</span>
                    </div>

                    <span className={styles.btn}>Bid Now →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && effectiveItems.length === 0 && (
          <p className={styles.empty}>
            No featured auction items right now, but you can still browse all live items below.
          </p>
        )}

        <div className={styles.moreWrap}>
          <Link href="#auction" className={styles.moreBtn}>
            View all auction items
          </Link>
        </div>
      </div>
    </section>
  );
}

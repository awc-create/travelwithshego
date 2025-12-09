// src/components/donation/listing/AuctionListing.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AuctionListing.module.scss';

export const auctionListingMetadata = {
  title: 'All Donation Auction Items – Travel with Shego',
  description:
    'Browse all available auction items. Bid on checked and graded electronics while your donation supports children and families in Baraawe.',
};

// 👇 set true for “coming soon” mode
const AUCTIONS_COMING_SOON = true;

// This should match what /api/auction/public returns
export type PublicAuctionItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  pricePence: number;
  highestBidPence: number | null;
  bidCount: number;
  endsAt: string | null; // ISO string from API
};

// Fallback/demo items if API fails or no items yet
const FALLBACK_ITEMS: PublicAuctionItem[] = [
  {
    id: '1',
    slug: 'iphone-13-pro-demo',
    title: 'iPhone 13 Pro – 128GB, unlocked',
    description: 'Fully checked, battery health verified and securely wiped.',
    imageUrl: '/images/donation/sample/iphone13.jpg',
    pricePence: 20000,
    highestBidPence: 22000,
    bidCount: 9,
    endsAt: null,
  },
  {
    id: '2',
    slug: 'macbook-air-m1-demo',
    title: 'MacBook Air M1 – 8GB / 256GB',
    description: 'Grade A device with minor cosmetic marks. Perfect student or work laptop.',
    imageUrl: '/images/donation/sample/macbook-air.jpg',
    pricePence: 35000,
    highestBidPence: 39000,
    bidCount: 14,
    endsAt: null,
  },
];

const ITEMS_PER_PAGE = 4;
const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD = 50; // px

const formatMoney = (pence: number | null) => {
  if (pence == null) return '£0';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  })
    .format(pence / 100)
    .replace('.00', '');
};

const formatTimeLeft = (endsAt: string | null) => {
  if (!endsAt) return '—';

  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const diffMs = end - now;
  if (diffMs <= 0) return 'Ended';

  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 1) {
    const mins = Math.round(diffHours * 60);
    return `${mins} min${mins === 1 ? '' : 's'}`;
  }
  if (diffHours < 24) {
    const hrs = Math.round(diffHours);
    return `${hrs} hour${hrs === 1 ? '' : 's'}`;
  }
  const days = Math.round(diffHours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
};

export default function AuctionListing() {
  // 👇 hooks are always called
  const [items, setItems] = useState<PublicAuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch live auction items from API
  useEffect(() => {
    let cancelled = false;

    // Don’t fetch anything in “coming soon” mode
    if (AUCTIONS_COMING_SOON) {
      setLoading(false);
      setItems([]);
      return () => {
        cancelled = true;
      };
    }

    async function fetchItems() {
      try {
        setLoading(true);
        const res = await fetch('/api/auction/public', { cache: 'no-store' });

        if (!res.ok) {
          throw new Error('Failed to load items');
        }

        const data = (await res.json()) as PublicAuctionItem[];

        if (!cancelled) {
          setItems(data.length ? data : FALLBACK_ITEMS);
          setCurrentPage(0);
        }
      } catch (err) {
        console.error('[AUCTION_LISTING_ERROR]', err);
        if (!cancelled) {
          setItems(FALLBACK_ITEMS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchItems();

    return () => {
      cancelled = true;
    };
  }, []);

  const pages = useMemo(() => {
    if (!items.length) return [];
    const chunks: PublicAuctionItem[][] = [];
    for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
      chunks.push(items.slice(i, i + ITEMS_PER_PAGE));
    }
    return chunks;
  }, [items]);

  const pageCount = pages.length || 1;

  const goToPage = (index: number) => {
    if (!pages.length) return;
    const next = (index + pageCount) % pageCount;
    setCurrentPage(next);
  };

  const handleNext = () => goToPage(currentPage + 1);
  const handlePrev = () => goToPage(currentPage - 1);

  // Autoplay – disabled in coming-soon mode
  useEffect(() => {
    if (!pages.length || AUCTIONS_COMING_SOON) return;

    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % pageCount);
    }, AUTOPLAY_MS);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [pages.length, pageCount]);

  // Touch/swipe handlers
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (touchStartX.current == null) return;
    const endX = event.changedTouches[0].clientX;
    const deltaX = endX - touchStartX.current;

    if (deltaX > SWIPE_THRESHOLD) {
      handlePrev();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      handleNext();
    }

    touchStartX.current = null;
  };

  const isSkeleton = loading && !items.length;

  return (
    <section id="auction" className={styles.wrap} aria-labelledby="auction-listing-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <h2 id="auction-listing-heading" className={styles.heading}>
              {AUCTIONS_COMING_SOON ? (
                <>
                  Auction <span className={styles.gold}>coming soon</span>
                </>
              ) : (
                <>
                  Browse all <span className={styles.gold}>Auction</span> items
                </>
              )}
            </h2>
            <p className={styles.sub}>
              {AUCTIONS_COMING_SOON ? (
                <>
                  We&apos;re setting up our first round of electronics auctions. Once live, every
                  winning bid will become a donation that supports housing, education and care in
                  Baraawe.
                </>
              ) : (
                <>
                  Every winning bid becomes a <span className={styles.gold}>donation</span> that
                  supports housing, education and care in Baraawe.
                </>
              )}
            </p>
          </div>
        </header>

        {AUCTIONS_COMING_SOON ? (
          <>
            <div className={styles.comingSoonBox}>
              <p>
                Auction bidding is temporarily disabled while we finalise the system. No items are
                available to bid on right now, but you can still support the project with a direct
                donation.
              </p>
            </div>

            <p className={styles.footerNote}>
              All future auction items will be checked, graded and securely wiped before listing. No
              cash-in-person for auction wins — payment will be handled only through our official
              donation account.
            </p>
          </>
        ) : (
          <>
            <div className={styles.carousel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div
                className={styles.track}
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
              >
                {isSkeleton
                  ? Array.from({ length: 1 }).map((_, idx) => (
                      <div key={idx} className={`${styles.slide} ${styles.skeleton}`} />
                    ))
                  : pages.map((pageItems, pageIndex) => (
                      <div key={pageIndex} className={styles.slide}>
                        <div className={styles.pageGrid}>
                          {pageItems.map((item) => {
                            const currentBid =
                              item.highestBidPence != null ? item.highestBidPence : item.pricePence;
                            const isNew = item.bidCount === 0;

                            return (
                              <article key={item.id} className={styles.card}>
                                <Link
                                  href={`/auction/${item.slug}`}
                                  className={styles.cardLink}
                                  aria-label={`View auction item ${item.title}`}
                                >
                                  <div className={styles.thumb}>
                                    <Image
                                      src={item.imageUrl || '/images/donation/sample/iphone13.jpg'}
                                      alt={item.title}
                                      fill
                                      sizes="(max-width: 768px) 100vw, 280px"
                                      className={styles.img}
                                    />
                                    {isNew && <span className={styles.badgeNew}>New</span>}
                                  </div>

                                  <div className={styles.body}>
                                    <h3 className={styles.title}>{item.title}</h3>
                                    <p className={styles.desc}>{item.description}</p>

                                    <dl className={styles.meta}>
                                      <div className={styles.metaRow}>
                                        <dt>Current bid</dt>
                                        <dd>{formatMoney(currentBid)}</dd>
                                      </div>
                                      <div className={styles.metaRow}>
                                        <dt>Bids</dt>
                                        <dd>{item.bidCount}</dd>
                                      </div>
                                      <div className={styles.metaRow}>
                                        <dt>Time left</dt>
                                        <dd>{formatTimeLeft(item.endsAt)}</dd>
                                      </div>
                                    </dl>

                                    <span className={styles.cta}>Place a bid →</span>
                                  </div>
                                </Link>
                              </article>
                            );
                          })}
                        </div>
                      </div>
                    ))}
              </div>

              {!isSkeleton && pageCount > 1 && (
                <>
                  <div className={styles.nav}>
                    <button
                      type="button"
                      className={styles.navBtn}
                      onClick={handlePrev}
                      aria-label="Previous auction items"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className={styles.navBtn}
                      onClick={handleNext}
                      aria-label="Next auction items"
                    >
                      ›
                    </button>
                  </div>

                  <div className={styles.dots}>
                    {pages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`${styles.dot} ${idx === currentPage ? styles.dotActive : ''}`}
                        onClick={() => goToPage(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <p className={styles.footerNote}>
              All items are checked, graded and securely wiped before listing. No cash-in-person for
              auction wins — payment is handled through our official donation account only.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

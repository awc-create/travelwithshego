'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './AuctionHighlights.module.scss';

export const auctionHighlightsMetadata = {
  title: 'Top Donation Auction Items – Quick Bids',
  description:
    'Browse featured items available for bidding. Win items you love while supporting children and families in Baraawe.',
};

type HighlightItem = {
  id: string;
  title: string;
  img: string;
  currentBid: string;
  endsIn: string;
};

const featuredItems: HighlightItem[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro – Excellent Condition',
    img: '/images/donation/sample/iphone13.jpg',
    currentBid: '£220',
    endsIn: '2 days',
  },
  {
    id: '2',
    title: 'MacBook Air M1 – Grade A',
    img: '/images/donation/sample/macbook-air.jpg',
    currentBid: '£390',
    endsIn: '5 hours',
  },
  {
    id: '3',
    title: 'Samsung Galaxy Tab S7',
    img: '/images/donation/sample/samsung-tab.jpg',
    currentBid: '£110',
    endsIn: '1 day',
  },
];

export default function AuctionHighlights() {
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

        <div className={styles.grid}>
          {featuredItems.map((item) => (
            <Link key={item.id} href={`/auction/${item.id}`} className={styles.card}>
              <div className={styles.imgWrap}>
                <Image
                  src={item.img}
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
                    Current Bid: <strong>{item.currentBid}</strong>
                  </span>
                  <span className={styles.timer}>Ends in {item.endsIn}</span>
                </div>

                <span className={styles.btn}>Bid Now →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.moreWrap}>
          <Link href="#auction" className={styles.moreBtn}>
            View all auction items
          </Link>
        </div>
      </div>
    </section>
  );
}

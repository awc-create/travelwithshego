'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './AuctionListing.module.scss';

export const auctionListingMetadata = {
  title: 'All Donation Auction Items – Travel with Shego',
  description:
    'Browse all available auction items. Bid on checked and graded electronics while your Donation supports children and families in Baraawe.',
};

type AuctionItem = {
  id: string;
  title: string;
  img: string;
  condition: 'A' | 'B' | 'C';
  currentBid: string;
  endsIn: string;
  bids: number;
  endingSoon?: boolean;
};

const items: AuctionItem[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro – 128GB, unlocked',
    img: '/images/donation/sample/iphone13.jpg',
    condition: 'A',
    currentBid: '£220',
    endsIn: '2 days',
    bids: 9,
  },
  {
    id: '2',
    title: 'MacBook Air M1 – 8GB / 256GB',
    img: '/images/donation/sample/macbook-air.jpg',
    condition: 'A',
    currentBid: '£390',
    endsIn: '5 hours',
    bids: 14,
    endingSoon: true,
  },
  {
    id: '3',
    title: 'Samsung Galaxy Tab S7 – 64GB',
    img: '/images/donation/sample/samsung-tab.jpg',
    condition: 'B',
    currentBid: '£110',
    endsIn: '1 day',
    bids: 6,
  },
  {
    id: '4',
    title: 'Apple Watch Series 7 – GPS',
    img: '/images/donation/sample/apple-watch.jpg',
    condition: 'B',
    currentBid: '£80',
    endsIn: '3 days',
    bids: 4,
  },
];

function conditionLabel(cond: AuctionItem['condition']) {
  switch (cond) {
    case 'A':
      return 'Grade A – Excellent';
    case 'B':
      return 'Grade B – Very Good';
    case 'C':
      return 'Grade C – Good';
    default:
      return 'Graded';
  }
}

export default function AuctionListing() {
  return (
    <section id="auction" className={styles.wrap} aria-labelledby="auction-listing-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <h2 id="auction-listing-heading" className={styles.heading}>
              Browse all <span className={styles.gold}>Auction</span> items
            </h2>
            <p className={styles.sub}>
              Every winning bid becomes a <span className={styles.gold}>Donation</span> that
              supports housing, education and care in Baraawe.
            </p>
          </div>

          <div className={styles.filters} aria-label="Sort and filter items">
            <label className={styles.filterLabel}>
              Sort by
              <select className={styles.select} defaultValue="ending">
                <option value="ending">Ending soon</option>
                <option value="bid">Highest bid</option>
                <option value="new">Newly added</option>
              </select>
            </label>
          </div>
        </header>

        <div className={styles.grid}>
          {items.map((item) => (
            <article
              key={item.id}
              className={`${styles.card} ${item.endingSoon ? styles.cardSoon : ''}`}
            >
              <Link href={`/auction/${item.id}`} className={styles.cardLink}>
                <div className={styles.thumb}>
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className={styles.img}
                  />
                  {item.endingSoon && <span className={styles.badge}>Ending soon</span>}
                </div>

                <div className={styles.body}>
                  <h3 className={styles.title}>{item.title}</h3>

                  <p className={styles.condition}>{conditionLabel(item.condition)}</p>

                  <dl className={styles.meta}>
                    <div className={styles.metaRow}>
                      <dt>Current bid</dt>
                      <dd>{item.currentBid}</dd>
                    </div>
                    <div className={styles.metaRow}>
                      <dt>Time left</dt>
                      <dd>{item.endsIn}</dd>
                    </div>
                    <div className={styles.metaRow}>
                      <dt>Bids</dt>
                      <dd>{item.bids}</dd>
                    </div>
                  </dl>

                  <span className={styles.cta}>Place a bid →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <p className={styles.footerNote}>
          All items are checked, graded and securely wiped before listing. No cash-in-person for
          auction wins — payment is handled through our official Donation account only.
        </p>
      </div>
    </section>
  );
}

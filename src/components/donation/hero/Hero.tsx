'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import styles from './Hero.module.scss';

export const heroMetadata = {
  title: 'Donation & Auction Hub – Travel with Shego',
  description:
    'Your Donation gives shelter, safety and education to children and families in Baraawe. Give directly or support by bidding on carefully-checked items.',
  ogImage: '/images/donation/og-donation-hero.jpg',
};

type Props = {
  imageSrc?: string;
  imageAlt?: string;
  raisedPence?: number;
  goalPence?: number;
};

const fmtMoney = (pence: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  })
    .format(pence / 100)
    .replace('.00', '');

export default function Hero({
  // ⭐ NEW DEFAULT IMAGE HERE
  imageSrc = '/assets/hero-donation.png',
  imageAlt = 'Illustration of children in Baraawe receiving support',
  raisedPence = 3_400 * 100,
  goalPence = 10_000 * 100,
}: Props) {
  const animRaised = useAnimatedNumber(raisedPence);
  const animGoal = useAnimatedNumber(goalPence);
  const pct = animGoal > 0 ? Math.min(100, Math.round((animRaised / animGoal) * 100)) : 0;

  return (
    <section
      className={styles.wrap}
      aria-labelledby="donation-hero-heading"
      aria-describedby="donation-hero-sub"
    >
      {/* Lead block */}
      <div className={styles.lead}>
        <span className={styles.kicker}>Donation &amp; Auction Hub</span>

        <h1 id="donation-hero-heading" className={styles.title}>
          Hope, home &amp; opportunity through <span className={styles.goldWord}>Donation</span>.
        </h1>

        <p id="donation-hero-sub" className={styles.sub}>
          Your <span className={styles.goldWord}>Donation</span> gives safe shelter, education and
          daily care to children and families in Baraawe. You can give directly, or support by
          bidding on carefully inspected electronics and tech items.
        </p>
      </div>

      {/* Two-column content */}
      <div className={styles.grid}>
        {/* LEFT SIDE IMAGE */}
        <div className={styles.media}>
          <div className={styles.frame}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className={styles.img}
              priority
            />
          </div>
        </div>

        {/* RIGHT SIDE TEXT */}
        <div className={styles.copy}>
          <p className={styles.p}>
            We keep the process simple and transparent: choose a direct gift, or place a bid on an
            item you love. When a bid wins, the Donation is sent through our secure account and the
            item is shipped safely to you.
          </p>

          <p className={styles.p}>
            Every contribution supports practical needs in Baraawe — from safe places to sleep, to
            school supplies, meals and ongoing care.
          </p>

          <div className={styles.actions}>
            <Link href="#direct-give" className={styles.cta}>
              Make a Donation
            </Link>
            <Link href="#auction" className={styles.secondary}>
              Browse items to bid on
            </Link>
          </div>

          {/* Progress card */}
          <div className={styles.progressCard} aria-label="Current appeal">
            <div className={styles.progressTop}>
              <span className={styles.progressLabel}>Current appeal</span>
              <span className={styles.progressNumbers}>
                <span className={styles.progressStrong}>{fmtMoney(animRaised)} raised</span>
                <span>Goal: {fmtMoney(animGoal)}</span>
              </span>
            </div>

            <div className={styles.progressBar} aria-hidden="true">
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>

            <p className={styles.progressNote}>
              100% of your <span className={styles.goldWord}>Donation</span> goes directly to
              shelter, education and care in Baraawe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

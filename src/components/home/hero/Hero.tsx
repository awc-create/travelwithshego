// src/components/home/hero/Hero.tsx
'use client';

import Head from 'next/head';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import styles from './Hero.module.scss';

type HeroProps = {
  raised?: number;
  goal?: number;
  donateHref?: string;
};

export default function Hero({ raised = 3400, goal = 10000, donateHref = '/donate' }: HeroProps) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));

  const scrollToMission = () => {
    document.querySelector('#mission')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <link rel="preload" href="/assets/hero.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/assets/hero-poster.jpg" as="image" />
      </Head>

      <header className={styles.hero} role="banner" aria-label="Baraawe Hope Center Hero">
        <div className={styles.videoWrapper}>
          <video
            className={styles.video}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/assets/hero-poster.jpg"
          >
            <source src="/assets/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className={styles.gradient} />
        <div className={styles.overlay} />

        <div className={styles.content}>
          <h1>Hope &amp; Home for Baraawe&#39;s Children</h1>
          <p className={styles.sub}>
            We&#39;re building a safe haven for orphans and struggling families, a place where every
            child can live, learn, and dream without fear. Your support brings light to those with
            nowhere else to go.
          </p>

          <div className={styles.actions}>
            <Link
              href={donateHref}
              className={styles.cta}
              aria-label="Donate to Baraawe Hope Center"
            >
              Give Shelter &amp; Hope
            </Link>
            <Link href="#project" className={styles.secondary}>
              Learn about our mission
            </Link>
          </div>

          <div
            className={styles.progress}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label={`Raised £${raised.toLocaleString()} of £${goal.toLocaleString()}`}
          >
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <div className={styles.progressMeta}>
            <span>£{raised.toLocaleString()} raised</span>
            <span>Goal: £{goal.toLocaleString()}</span>
          </div>
        </div>

        <button
          className={styles.scrollDown}
          aria-label="Scroll to mission"
          onClick={scrollToMission}
        >
          <FaChevronDown />
        </button>

        {/* wave divider */}
        <div className={styles.wave} aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64 C240,96 480,0 720,26.67 C960,53.33 1200,128 1440,96 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </header>
    </>
  );
}

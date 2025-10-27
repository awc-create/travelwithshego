'use client';

import dynamic from 'next/dynamic';
import styles from './Impact.module.scss';

const ImpactClient = dynamic(() => import('./ImpactClient'), { ssr: false });

export default function Impact() {
  return (
    <section className={styles.impactSection} aria-labelledby="impact-title">
      {/* Header — NOT in a card */}
      <div className={styles.header}>
        <h2 id="impact-title" className={styles.heading}>
          <span className={styles.highlight}>Baraawe’s</span> Impact Across Generations
        </h2>
      </div>

      {/* Plain content (no card), with a real button CTA */}
      <div className={styles.content}>
        <ImpactClient />
        <a href="#support" className={styles.ctaBtn}>
          See how we’re helping Baraawe rebuild — one life at a time. →
        </a>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import styles from './HomeSettings.module.scss';
import HeroSettings from './HeroSettings';
import MissionSettings from './MissionSettings';
import GallerySettings from './GallerySettings';
import TestimonialSettings from './TestimonialSettings';
import DonationSettings from './DonationSettings';

type HomeTab = 'hero' | 'mission' | 'gallery' | 'testimonial' | 'donation';
const TABS: { key: HomeTab; label: string }[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'mission', label: 'Mission' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'testimonial', label: 'Testimonial' },
  { key: 'donation', label: 'Donation' },
];

export default function HomeSettings() {
  const [active, setActive] = useState<HomeTab>('hero');

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Home</h2>
        <p>Manage the content shown on your homepage.</p>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Home Sub-Tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            className={`${styles.tab} ${active === t.key ? styles.active : ''}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.panel} role="tabpanel">
        {active === 'hero' && <HeroSettings />}
        {active === 'mission' && <MissionSettings />}
        {active === 'gallery' && <GallerySettings />}
        {active === 'testimonial' && <TestimonialSettings />}
        {active === 'donation' && <DonationSettings />}
      </div>
    </section>
  );
}

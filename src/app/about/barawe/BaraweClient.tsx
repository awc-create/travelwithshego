'use client';

import styles from './Barawe.module.scss';
import Hero from '@/components/about/barawe/hero/Hero';
import History from '@/components/about/barawe/history/History';
import Language from '@/components/about/barawe/language/Language';

export default function BaraweClient() {
  return (
    <main className={styles.page}>
      <Hero
        imageSrc="/assets/barawe/hero.jpg"
        title="Baraawe: A City of History and Hope"
        subtitle="A coastal gem of Somalia — where language, culture, and scholarship meet."
      />

      <div className={styles.section}>
        <History />
      </div>

      <div className={styles.section}>
        <Language dictionaryHref="https://chimiinidictionary.com" />
      </div>

      {/* Later: <Gallery /> + <CTA /> */}
    </main>
  );
}

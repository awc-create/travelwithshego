// src/app/about/barawe/BaraweClient.tsx
'use client';

import { useEffect } from 'react';
import styles from './Barawe.module.scss';
import Hero from '@/components/about/barawe/hero/Hero';
import History from '@/components/about/barawe/history/History';
import Language from '@/components/about/barawe/language/Language';
import Impact from '@/components/about/barawe/impact/Impact';

function useFlowReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(`.${styles.flowReveal}`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add(styles.isVisible);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function BaraweClient() {
  useFlowReveal();
  return (
    <main className={styles.page}>
      <Hero
        imageSrc="/assets/hero-baraawe.jpeg"
        title="Baraawe: A City of History and Hope"
        subtitle="A coastal gem of Somalia — where language, culture, and scholarship meet."
      />

      <section className={styles.section}>
        <div className={`${styles.ambient} ${styles.flowReveal}`}>
          <History />
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.ambient} ${styles.flowReveal}`}>
          <Language
            title="Chimwiini: The Voice of Baraawe"
            dictionaryHref="https://www.chimwiini.com/"
            dictionaryLabel="Explore the Chimwiini Dictionary →"
            desc="Once a lingua franca of East African trade, Chimwiini carries centuries of poetic, religious, and scholarly tradition. Efforts to preserve and document it continue through diaspora projects."
            facts={[
              { label: 'Language Family', value: 'Northeast Coast Bantu, Sabaki subgroup' },
              { label: 'Scripts', value: 'Arabic manuscripts, now Latin transcription' },
              { label: 'Legacy', value: 'Uways al-Barawi, Dada Masiti, Qassim al-Barawi' },
            ]}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.ambient} ${styles.flowReveal}`}>
          <Impact />
        </div>
      </section>
    </main>
  );
}

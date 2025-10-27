// src/components/about/barawe/hero/Hero.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import BaraweMap from '../map/Map';
import styles from './Hero.module.scss';

type Props = {
  title?: string;
  subtitle?: string;
  paragraphs?: string[];
  imageSrc: string;
  imageAlt?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function AboutBaraaweHero({
  title = 'Baraawe: A City of History and Hope',
  subtitle = 'A coastal gem of Somalia — rich in culture, language, and resilience.',
  paragraphs = [
    'Set on Somalia’s southern coast, Baraawe (Brava) has long been a crossroads of trade and tradition. Its people carry a proud heritage of seamanship, poetry, and community leadership.',
    'Understanding Baraawe helps explain why education matters here: it preserves language and culture, creates opportunity for young people, and strengthens families for generations.',
  ],
  imageSrc,
  imageAlt = 'Life in Baraawe',
  ctaHref = '/donate',
  ctaLabel = 'Support Education in Baraawe',
  secondaryHref = '/about',
  secondaryLabel = 'Meet the Founder',
}: Props) {
  return (
    <>
      <section className={styles.wrap} aria-labelledby="about-baraawe-heading">
        <div className={styles.lead}>
          <span className={styles.kicker}>Baraawe</span>
          <h1 id="about-baraawe-heading" className={styles.title}>
            {title}
          </h1>
          <p className={styles.sub}>{subtitle}</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.media}>
            <div className={styles.frame}>
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className={styles.img}
                sizes="(max-width: 1024px) 100vw, 560px"
                priority
              />
            </div>
          </div>

          <div className={styles.copy}>
            {paragraphs.map((p, i) => (
              <p key={i} className={styles.p}>
                {p}
              </p>
            ))}

            <div className={styles.actions}>
              <Link href={ctaHref} className={styles.cta}>
                {ctaLabel}
              </Link>
              <Link href={secondaryHref} className={styles.secondary}>
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BaraweMap />
    </>
  );
}

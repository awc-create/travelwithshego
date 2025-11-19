'use client';

import { motion } from 'framer-motion';
import styles from './ShegoBand.module.scss';

export default function ShegoBand() {
  return (
    <section className={styles.bandSection} aria-labelledby="shegoband-heading">
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* heading */}
        <h2 id="shegoband-heading" className={styles.heading}>
          The <span className={styles.highlight}>Shego Band</span> — a new Somali sound in the
          diaspora.
        </h2>

        <p className={styles.intro}>
          Led by singer and composer <strong>Shego Said</strong>, the Shego Band blended Somali
          dance rhythms with hip-hop, soul and jazz influences. Switching between Somali, Arabic and
          Swahili, their sound became a defining voice for Somalis growing up away from home.
        </p>

        <p className={styles.paragraph}>
          After leaving Brava and eventually settling in Toronto, Shego brought together
          professional musicians and producers from across the diaspora. On stage and in studio,
          they became a cultural anchor — proving that even in exile, music, language and heritage
          stay alive.
        </p>

        {/* trio */}
        <div className={styles.trio}>
          <div className={styles.card}>
            <span className={styles.label}>Line-up</span>
            <span className={styles.value}>
              Shego (vocals, oud, guitar), Said (keys), Mohiadin (congas), Scott Powell (bass), Art
              (drums), Waldo (lead guitar)
            </span>
          </div>

          <div className={styles.card}>
            <span className={styles.label}>Sound</span>
            <span className={styles.value}>
              Somali dance • Hip-hop • Soul • East African rhythms
            </span>
          </div>

          <div className={styles.card}>
            <span className={styles.label}>Legacy</span>
            <span className={styles.value}>
              A defining influence on modern Somali music in the diaspora.
            </span>
          </div>
        </div>

        <p className={styles.outro}>
          In the mid-2000s, ShegoBand toured with Arts Midwest World Fest, performing alongside
          Somali legends like Hibo Nuur and oud master Kooshin. While Shego is no longer performing
          actively, the body of work lives on — and continues to inspire young Somali artists
          worldwide.
        </p>
      </motion.div>
    </section>
  );
}

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
        <h2 id="shegoband-heading" className={styles.heading}>
          The <span className={styles.highlight}>ShegoBand,</span> a Somali sound that travelled.
        </h2>

        <p className={styles.intro}>
          Led by singer, composer and producer <strong>Shego Said</strong>, ShegoBand blended Somali
          dance rhythms with hip-hop, soul and jazz influences. It became a sound that felt rooted
          in home while still speaking to a generation shaped by migration and diaspora.
        </p>

        <p className={styles.paragraph}>
          After leaving Brava and eventually settling in Toronto, Shego brought together talented
          musicians and producers who could honour traditional Somali feeling while giving it a new
          energy on stage and in studio. Their music became both memory and movement. A way of
          keeping identity alive far from home.
        </p>

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
              Somali dance • Hip-hop • Soul • Jazz textures • East African rhythms
            </span>
          </div>

          <div className={styles.card}>
            <span className={styles.label}>Legacy</span>
            <span className={styles.value}>
              A defining cultural voice for Somalis across the diaspora.
            </span>
          </div>
        </div>

        <p className={styles.outro}>
          In the mid-2000s, ShegoBand toured with Arts Midwest World Fest alongside Somali artists
          including Hibo Nuur and Kooshin. Those performances introduced many audiences to Somali
          music through joy, artistry and story, not just headlines about conflict. That cultural
          legacy still matters, and it still shapes the work Shego does now.
        </p>
      </motion.div>
    </section>
  );
}

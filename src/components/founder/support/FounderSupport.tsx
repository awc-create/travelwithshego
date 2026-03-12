'use client';

import { motion } from 'framer-motion';
import styles from './FounderSupport.module.scss';

export default function FounderSupport() {
  return (
    <section className={styles.supportSection} aria-labelledby="founder-support-heading">
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <header className={styles.header}>
          <span className={styles.kicker}>The road ahead</span>
          <h2 id="founder-support-heading" className={styles.heading}>
            The vision is bigger than what exists today —{' '}
            <span className={styles.highlight}>and support helps carry it forward.</span>
          </h2>
          <p className={styles.lead}>
            There has already been progress, but the needs are still larger than the resources.
            Classroom space is limited, supplies run short, meal support is not always consistent,
            and better infrastructure is still needed. The hope is to keep building carefully, step
            by step, without losing the dignity of the people this work is meant to serve.
          </p>
        </header>

        <div className={styles.grid} aria-label="Ways the mission can grow">
          <article className={styles.card}>
            <p className={styles.label}>1 · Expand the space</p>
            <h3 className={styles.title}>More room for children to learn safely</h3>
            <p className={styles.body}>
              The long-term aim is to strengthen classroom capacity, improve shelter, and create a
              more stable environment for education and care.
            </p>
            <p className={styles.detail}>
              Better physical space means more children can be supported with dignity and
              consistency.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>2 · Build practical programmes</p>
            <h3 className={styles.title}>Sewing, carpentry and life skills</h3>
            <p className={styles.body}>
              The vision reaches beyond immediate relief. It includes vocational training, practical
              skills and opportunities that can help families become stronger and more independent.
            </p>
            <p className={styles.detail}>
              When adults can earn, households stabilise — and children benefit directly.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>3 · Keep the promise alive</p>
            <h3 className={styles.title}>Support meals, education and family dignity</h3>
            <p className={styles.body}>
              Some people may help through giving, others by sharing the story, opening doors,
              connecting resources or simply staying involved over time.
            </p>
            <p className={styles.detail}>
              What matters most is steady, sincere support that protects children and strengthens
              the community from within.
            </p>
          </article>
        </div>

        <footer className={styles.footer}>
          <p className={styles.note}>
            Shego was once on stages around the world. Today, the work looks different: classrooms,
            meals, supplies, conversations, and the daily effort of helping children who have
            already lost too much. Dada Fatima’s dream was simple — no child without education, no
            child without food. This mission continues in her name.
          </p>

          <a href="/contact" className={styles.primary}>
            Start a private conversation
          </a>
        </footer>
      </motion.div>
    </section>
  );
}

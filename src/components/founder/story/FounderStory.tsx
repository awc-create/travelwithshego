'use client';

import { motion } from 'framer-motion';
import styles from './FounderStory.module.scss';

interface FounderStoryProps {
  onScrollToDonate?: () => void;
}

export default function FounderStory({ onScrollToDonate }: FounderStoryProps) {
  const handleDonateClick = () => {
    if (onScrollToDonate) {
      onScrollToDonate();
      return;
    }

    const donate = document.querySelector('#donate');
    if (donate instanceof HTMLElement) {
      donate.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className={styles.storySection}
      data-founder-scroll-target
      aria-labelledby="founder-story-heading"
    >
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div>
          <span className={styles.kicker}>Continuing my grandmother&apos;s dream</span>

          <h2 id="founder-story-heading" className={styles.heading}>
            A legacy of education, dignity and{' '}
            <span className={styles.highlight}>hope in Barawa.</span>
          </h2>

          <p className={styles.lead}>
            My name is Shego Said. For many years, people knew me through music. But the deepest
            reason behind this work comes from one woman: my grandmother, Dada Fatima.
          </p>

          <div className={styles.body}>
            <p>
              She was from Barawa, a coastal town in Somalia with its own language, identity and
              history. During the civil war, Barawa was deeply affected. Families were torn apart,
              many parents were killed, schools were damaged, and children were left orphaned or
              living in extreme hardship.
            </p>

            <p>
              Hunger became common. Resources disappeared. For many children, education stopped
              being a possibility and survival became the only focus.
            </p>

            <p>
              My grandmother believed one thing with absolute certainty: no child should grow up
              without education, and no child should go to sleep hungry.
            </p>

            <p>
              Before she passed away, she gave me a piece of land. But to her, it was never just
              land. It was a mission. She asked me to use it to build a school and community center
              for orphaned children and vulnerable families — and she made me promise that it would
              always belong to the children.
            </p>

            <p>
              That promise changed my life. What you see through Travel with Shego today begins
              there.
            </p>
          </div>
        </div>

        <aside className={styles.timeline} aria-label="How the story took shape">
          <p className={styles.pillLabel}>The foundation of the mission</p>

          <div className={styles.eventCard}>
            <span className={styles.eventMeta}>1 · Barawa</span>
            <span className={styles.eventTitle}>A place with history, culture and loss</span>
            <p className={styles.eventBody}>
              Barawa is more than a hometown. It is the place that shaped Shego’s roots and the
              place where war left many children and families without support.
            </p>
          </div>

          <div className={styles.eventCard}>
            <span className={styles.eventMeta}>2 · Dada Fatima</span>
            <span className={styles.eventTitle}>A grandmother’s vision</span>
            <p className={styles.eventBody}>
              Dada Fatima believed education and food were not luxuries. They were a child’s basic
              right, even in the hardest times.
            </p>
          </div>

          <div className={styles.eventCard}>
            <span className={styles.eventMeta}>3 · The promise</span>
            <span className={styles.eventTitle}>Land given for the children</span>
            <p className={styles.eventBody}>
              Before she passed, she entrusted Shego with land and a responsibility: build something
              that would protect, feed and educate future generations.
            </p>
          </div>

          <blockquote className={styles.quote}>
            “No child should grow up without education. No child should go to sleep hungry.”
          </blockquote>

          <p className={styles.footerNote}>
            That promise is still being carried forward today. And when people{' '}
            <button type="button" className={styles.link} onClick={handleDonateClick}>
              give support
            </button>
            , they become part of that promise too.
          </p>
        </aside>
      </motion.div>
    </section>
  );
}

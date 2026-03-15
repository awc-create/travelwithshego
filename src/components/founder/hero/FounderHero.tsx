'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import styles from './FounderHero.module.scss';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
    },
  },
};

const portraitVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const progressVariants: Variants = {
  hidden: { width: '0%' },
  visible: {
    width: '74%',
    transition: {
      duration: 0.95,
      ease: 'easeOut',
      delay: 0.25,
    },
  },
};

export default function FounderHero() {
  const handleScrollClick = () => {
    const el = document.querySelector('[data-founder-scroll-target]');
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className={styles.heroSection} aria-labelledby="founder-hero-title">
      <div className={styles.bgGlow} />

      <motion.div
        className={styles.heroContent}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className={styles.copy} variants={itemVariants}>
          <div className={styles.tagRow}>
            <span className={styles.tagPrimary}>Founder · ShegoBand · Community advocate</span>
            <span className={styles.tagSecondary}>Barawa / Baraawe · Somalia · Diaspora</span>
          </div>

          <motion.h1 id="founder-hero-title" className={styles.title} variants={itemVariants}>
            The story behind <span className={styles.highlight}>Travel With Shego, </span>
            from music to mission.
          </motion.h1>

          <motion.p className={styles.subtitle} variants={itemVariants}>
            Shego Said was once known for bringing Somali music to audiences across the world.
            Today, that same platform carries something deeper: a promise to continue his
            grandmother’s dream of supporting children and families in Barawa through education,
            meals and community care.
          </motion.p>

          <motion.div className={styles.keyCards} variants={itemVariants}>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Roots</span>
              <span className={styles.cardValue}>Barawa (Baraawe), Somalia</span>
            </div>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Past</span>
              <span className={styles.cardValue}>
                ShegoBand, touring, production & Somali cultural preservation
              </span>
            </div>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Today</span>
              <span className={styles.cardValue}>
                Supporting orphaned children, meals and community rebuilding
              </span>
            </div>
          </motion.div>

          <motion.div className={styles.actions} variants={itemVariants}>
            <motion.a
              href="#donate"
              className={styles.ctaPrimary}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              Support the mission
            </motion.a>

            <button type="button" className={styles.ctaSecondary} onClick={handleScrollClick}>
              Read the founder story
            </button>
          </motion.div>

          <motion.div className={styles.progressBlock} variants={itemVariants}>
            <div className={styles.progressTrack}>
              <motion.div className={styles.progressFill} variants={progressVariants} />
            </div>

            <div className={styles.progressMeta}>
              <span>
                A lifetime of music built trust, community and a voice that still reaches people.
              </span>
              <span>
                That legacy now helps carry forward education, dignity and hope in Barawa.
              </span>
            </div>

            <button type="button" className={styles.progressHint} onClick={handleScrollClick}>
              <span className={styles.progressDot} />
              <span>See how one promise changed everything</span>
            </button>
          </motion.div>
        </motion.div>

        <motion.div className={styles.portraitWrap} variants={portraitVariants}>
          <div className={styles.frame}>
            <Image
              src="/assets/shego-prof.jpeg"
              alt="Shego Said, founder of Travel with Shego and former band leader of ShegoBand"
              fill
              priority
              sizes="(min-width: 960px) 480px, 80vw"
              className={styles.portraitImg}
            />

            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              <span className={styles.badgeText}>
                A life in music, now rooted in community work
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <button
        type="button"
        className={styles.scrollCue}
        onClick={handleScrollClick}
        aria-label="Scroll to learn more about the founder"
      >
        <span className={styles.scrollDot} />
        <span>Scroll to the story</span>
      </button>
    </section>
  );
}

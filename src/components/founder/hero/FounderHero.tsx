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
    width: '68%',
    transition: {
      duration: 0.9,
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
      {/* Soft ambient background glow */}
      <div className={styles.bgGlow} />

      <motion.div
        className={styles.heroContent}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* LEFT – copy / story */}
        <motion.div className={styles.copy} variants={itemVariants}>
          <div className={styles.tagRow}>
            <span className={styles.tagPrimary}>Founder · Band leader · Producer</span>
            <span className={styles.tagSecondary}>Baraawe / Somali diaspora</span>
          </div>

          <motion.h1 id="founder-hero-title" className={styles.title} variants={itemVariants}>
            The story behind <span className={styles.highlight}>Travel with Shego</span> and
            ShegoBand.
          </motion.h1>

          <motion.p className={styles.subtitle} variants={itemVariants}>
            From playing guitar in Brava to building a life in Toronto, Shego has used music and
            storytelling to keep Somali culture alive in the diaspora. Travel with Shego now carries
            that work forward — honouring the legacy of ShegoBand and quietly supporting children
            and families back home in Somalia.
          </motion.p>

          {/* key facts */}
          <motion.div className={styles.keyCards} variants={itemVariants}>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Roots</span>
              <span className={styles.cardValue}>Brava (Baraawe), Somalia</span>
            </div>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Sound</span>
              <span className={styles.cardValue}>
                Somali dance, hip-hop, soul &amp; jazz influences
              </span>
            </div>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Today</span>
              <span className={styles.cardValue}>
                Preserving the music &amp; supporting community projects
              </span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div className={styles.actions} variants={itemVariants}>
            <motion.a
              href="#donate"
              className={styles.ctaPrimary}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              Support projects in Somalia
            </motion.a>

            <button type="button" className={styles.ctaSecondary} onClick={handleScrollClick}>
              Read the full founder story
            </button>
          </motion.div>

          {/* Progress / impact strip */}
          <motion.div className={styles.progressBlock} variants={itemVariants}>
            <div className={styles.progressTrack}>
              <motion.div className={styles.progressFill} variants={progressVariants} />
            </div>
            <div className={styles.progressMeta}>
              <span>
                Past tours, recordings and community work have already helped support children and
                families.
              </span>
              <span>
                Goal: keep that support going through this project and the ShegoBand legacy.
              </span>
            </div>
            <button type="button" className={styles.progressHint} onClick={handleScrollClick}>
              <span className={styles.progressDot} />
              <span>Learn how the music turned into support</span>
            </button>
          </motion.div>
        </motion.div>

        {/* RIGHT – founder portrait / card */}
        <motion.div className={styles.portraitWrap} variants={portraitVariants}>
          <div className={styles.frame}>
            <Image
              src="/assets/shego-prof.jpeg" // replace with real path
              alt="Shego Said, founder of Travel with Shego and band leader of ShegoBand"
              fill
              priority
              sizes="(min-width: 960px) 480px, 80vw"
              className={styles.portraitImg}
            />

            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              <span className={styles.badgeText}>
                From Brava to Toronto · Keeping Somali music alive
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* scroll cue pinned to bottom centre */}
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

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import styles from './FounderLegacy.module.scss';

// ✅ Just drop more items in this array when you have new photos
const baseFrames = [
  {
    src: '/assets/shego/band-1.jpg',
    alt: 'ShegoBand performing on stage',
    label: 'On stage with ShegoBand',
    meta: 'Toronto, early 2000s',
  },
  {
    src: '/assets/shego/band-2.jpeg',
    alt: 'Shego with musicians and friends',
    label: 'Friends & musicians',
    meta: 'Behind the scenes',
  },
  {
    src: '/assets/shego/band-3.jpeg',
    alt: 'Somali community concert',
    label: 'Somali community concert',
    meta: 'Diaspora gathering',
  },
];

// repeat each image twice so the strip feels longer
const reelFrames = [...baseFrames, ...baseFrames];

export default function FounderLegacy() {
  // ✅ Auto-shuffle the frames once on mount so it feels organic
  const shuffledFrames = useMemo(() => {
    const arr = [...reelFrames];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // we still duplicate to make the loop feel continuous
  const loopFrames = [...shuffledFrames, ...shuffledFrames];

  return (
    <section className={styles.legacySection} aria-labelledby="founder-legacy-heading">
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* LEFT – copy */}
        <div className={styles.copy}>
          <p className={styles.kicker}>Legacy &amp; moments</p>
          <h2 id="founder-legacy-heading" className={styles.heading}>
            A lifetime of music, <span className={styles.highlight}>kept alive in memories.</span>
          </h2>

          <p className={styles.lead}>
            For years, Travel with Shego and the Shego Band carried Somali stories onto stages
            across North America and beyond. Those seasons have passed, but the music, friendships
            and community that grew around them still shape how Shego gives back today.
          </p>

          <div className={styles.body}>
            <p>
              These photos are pieces of that journey — rehearsals in small halls, festival stages,
              late-night studio sessions and quiet visits with families in Somalia. Some are grainy,
              some are new, all carry a part of the story.
            </p>
            <p>
              Shego isn&apos;t actively touring now. Instead, the focus is on preserving the
              recordings, honouring the artists who shared the stage, and using whatever attention
              the archive still receives to quietly support children and families back home.
            </p>
          </div>

          <p className={styles.note}>
            Not every image is from the same tour or project — it&apos;s a personal archive. If you
            recognise yourself in one of these moments and would like it updated or removed, you can
            reach out via the contact page.
          </p>
        </div>

        {/* RIGHT – vertical film strip carousel */}
        <div className={styles.reelColumn} aria-label="Photo memories from Shego’s journey">
          <div className={styles.reelWrapper}>
            <div className={styles.reelShell}>
              {/* sprocket columns are drawn in CSS ::before/::after */}
              <div className={styles.reelMask}>
                <div className={styles.reelTrack}>
                  {loopFrames.map((frame, index) => (
                    <figure key={`${frame.src}-${index}`} className={styles.frame}>
                      <div className={styles.frameWindow}>
                        <div className={styles.frameMedia}>
                          <Image
                            src={frame.src}
                            alt={frame.alt}
                            fill
                            sizes="(min-width: 1024px) 220px, 60vw"
                            className={styles.img}
                          />
                        </div>
                      </div>
                      <figcaption className={styles.caption}>
                        <span className={styles.label}>{frame.label}</span>
                        <span className={styles.meta}>{frame.meta}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
            <p className={styles.reelHint}>Swipe, scroll or hover to linger on a frame.</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

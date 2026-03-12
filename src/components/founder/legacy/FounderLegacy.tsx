'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './FounderLegacy.module.scss';

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

const reelFrames = [...baseFrames, ...baseFrames];
type Frame = (typeof reelFrames)[number];

export default function FounderLegacy() {
  const [loopFrames, setLoopFrames] = useState<Frame[]>(() => [...reelFrames, ...reelFrames]);

  useEffect(() => {
    const arr = [...reelFrames];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setLoopFrames([...arr, ...arr]);
  }, []);

  return (
    <section className={styles.legacySection} aria-labelledby="founder-legacy-heading">
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className={styles.copy}>
          <p className={styles.kicker}>From music to mission</p>

          <h2 id="founder-legacy-heading" className={styles.heading}>
            When the stage became smaller, the purpose became{' '}
            <span className={styles.highlight}>much bigger.</span>
          </h2>

          <p className={styles.lead}>
            Leaving music was not easy. It had given Shego a voice, a name, and a way to bring joy
            to Somali communities around the world. But over time, his grandmother’s vision began to
            weigh more heavily on his heart than his own career.
          </p>

          <div className={styles.body}>
            <p>
              He made a decision: the next chapter of his life would not be built around applause or
              touring schedules, but around fulfilling a promise. For the past several years, that
              has meant working step by step to turn inherited land into a place of refuge, learning
              and care for children and vulnerable families in Barawa.
            </p>

            <p>
              The work has not been glamorous. It has involved sacrifice, financial pressure,
              patience and persistence. But it has also brought something music always carried at
              its best. Service, Connection and Hope.
            </p>

            <p>
              These photographs sit between those two worlds. They hold memories of the music years,
              but they also mark the path toward a quieter kind of legacy: using what was built in
              public to do something meaningful in private.
            </p>
          </div>

          <p className={styles.note}>
            This is no longer only Dada Fatima’s dream. It has become Shego’s life’s work.
          </p>
        </div>

        <div className={styles.reelColumn} aria-label="Photo memories from Shego’s journey">
          <div className={styles.reelWrapper}>
            <div className={styles.reelShell}>
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

            <p className={styles.reelHint}>
              Memories of the music years that led into today’s work.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

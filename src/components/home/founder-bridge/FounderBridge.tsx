// src/components/home/founder-bridge/FounderBridge.tsx
'use client';

import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import styles from './FounderBridge.module.scss';

type FounderBridgeProps = {
  id?: string;
  founderHref?: string;
};

export default function FounderBridge({
  id = 'founder-bridge',
  founderHref = '/founder',
}: FounderBridgeProps) {
  return (
    <section id={id} className={styles.section} aria-label="The story behind the mission">
      <div className="container">
        <div className={styles.wrap}>
          <div className={styles.copy}>
            <span className={styles.kicker}>The Story Behind the Mission</span>

            <h2>A Promise to Continue Dada Fatima&apos;s Dream</h2>

            <p>
              Travel with Shego began with a promise made in Barawa, Somalia. Before she passed
              away, Shego Said&apos;s grandmother, <strong>Dada Fatima</strong>, gave him land and
              asked him to use it for children, a place where they could learn, eat, and grow with
              dignity.
            </p>

            <p>
              After years performing internationally as a Somali musician, Shego chose to step away
              from that life and dedicate himself to fulfilling her vision.
            </p>

            <p>
              Today, that promise lives on through a growing community effort supporting orphaned
              and vulnerable children with education, meals, and practical care.
            </p>

            <div className={styles.footer}>
              <p className={styles.note}>
                What started as one grandmother&apos;s dream is becoming a lifeline for families in
                Barawa.
              </p>

              <Link href={founderHref} className={styles.cta}>
                Read Shego&apos;s story <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className={styles.pullQuote}>
            <div className={styles.quoteCard}>
              <span className={styles.quoteKicker}>Her vision</span>
              <blockquote>
                “No child should grow up without education. No child should go to sleep hungry.”
              </blockquote>
              <p>Dada Fatima&apos;s dream continues through this work in Barawa.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

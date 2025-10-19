'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Carousel.module.scss';

export type CarouselItem = {
  src: string;
  alt?: string;
  type?: 'image' | 'video'; // auto-detected by extension if omitted
};

export type CarouselProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  items: CarouselItem[];
  intervalMs?: number; // autoplay interval
  startIndex?: number;
  showDots?: boolean;
  showArrows?: boolean;
  contain?: boolean; // contain vs cover for media
};

function detectType(src: string): 'image' | 'video' {
  const s = src.toLowerCase();
  return s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.ogg') ? 'video' : 'image';
}

export default function Carousel({
  id,
  title,
  subtitle,
  items,
  intervalMs = 4200,
  startIndex = 0,
  showDots = true,
  showArrows = true,
  contain = false,
}: CarouselProps) {
  const [idx, setIdx] = useState(startIndex);
  const [paused, setPaused] = useState(false);

  const len = items.length;

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % len);
  }, [len]);

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + len) % len);
  }, [len]);

  const goto = useCallback(
    (i: number) => {
      setIdx(((i % len) + len) % len);
    },
    [len]
  );

  // autoplay with proper cleanup
  useEffect(() => {
    if (len <= 1 || paused) return;
    const t = setTimeout(next, intervalMs);
    return () => clearTimeout(t);
  }, [idx, paused, len, intervalMs, next]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  if (len === 0) return null;

  return (
    <section
      id={id}
      className={styles.wrap}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label={title ?? 'Carousel'}
    >
      {(title || subtitle) && (
        <div className={styles.lead}>
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      <div className={styles.viewport}>
        {showArrows && (
          <button className={`${styles.nav} ${styles.prev}`} onClick={prev} aria-label="Previous">
            ‹
          </button>
        )}

        <div className={styles.track} style={{ transform: `translateX(-${idx * 100}%)` }}>
          {items.map((item, i) => {
            const type = item.type ?? detectType(item.src);
            return (
              <div className={styles.slide} key={i} aria-hidden={i !== idx}>
                {type === 'image' ? (
                  <Image
                    src={item.src}
                    alt={item.alt ?? `Slide ${i + 1}`}
                    fill
                    priority={i === idx}
                    className={contain ? styles.mediaContain : styles.mediaCover}
                    sizes="100vw"
                  />
                ) : (
                  <video
                    className={contain ? styles.mediaContain : styles.mediaCover}
                    src={item.src}
                    muted
                    playsInline
                    autoPlay={i === idx}
                    loop
                    controls={false}
                  />
                )}
              </div>
            );
          })}
        </div>

        {showArrows && (
          <button className={`${styles.nav} ${styles.next}`} onClick={next} aria-label="Next">
            ›
          </button>
        )}
      </div>

      {showDots && (
        <div className={styles.dots} role="tablist" aria-label="Slides">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === idx}
              className={`${styles.dot} ${i === idx ? styles.active : ''}`}
              onClick={() => goto(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Carousel from '@/components/common/carousel/Carousel';
import styles from './Gallery.module.scss';

export type GalleryProps = {
  id?: string;
  caption?: string | null;
  images: string[]; // absolute or /public paths configured in next.config.js
  showCarousel?: boolean;
  carouselTitle?: string;
  carouselSubtitle?: string;
};

export default function Gallery({
  id = 'gallery',
  caption,
  images,
  showCarousel = true,
  carouselTitle = 'Snapshots of the Community',
  carouselSubtitle = 'Early building work, local crafts and volunteers',
}: GalleryProps) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  // Keyboard controls when lightbox is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, next, prev]);

  // Basic swipe support
  useEffect(() => {
    if (!open || !overlayRef.current) return;
    let startX = 0;
    const el = overlayRef.current;
    const onTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 40) prev();
      if (dx < -40) next();
    };
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [open, next, prev]);

  return (
    <section id={id} className={styles.gallery} aria-label="Photo Gallery">
      <div className="container">
        <div className={styles.lead}>
          <span className={styles.kicker}>Gallery</span>
          <h2>Moments of Hope</h2>
          {caption ? <p className={styles.desc}>{caption}</p> : null}
        </div>

        {/* Reusable carousel (optional) */}
        {showCarousel && images.length > 0 && (
          <div style={{ margin: '0 auto 1.25rem', maxWidth: 1100 }}>
            <Carousel
              items={images.map((src) => ({ src }))}
              title={carouselTitle}
              subtitle={carouselSubtitle}
              intervalMs={4800}
              showDots
              showArrows
            />
          </div>
        )}

        {images.length === 0 ? (
          <div className={styles.empty}>
            <p>
              No images yet — upload from the Admin&nbsp;<strong>Home → Gallery</strong>.
            </p>
          </div>
        ) : (
          <div className={styles.grid} role="list">
            {images.map((src, i) => (
              <button
                key={i}
                role="listitem"
                className={styles.card}
                onClick={() => openAt(i)}
                aria-label={`Open image ${i + 1} of ${images.length}`}
              >
                <Image
                  src={src}
                  alt={`Gallery item ${i + 1}`}
                  width={640}
                  height={480}
                  className={styles.img}
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {open && images[idx] && (
        <div
          ref={overlayRef}
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={(e) => {
            if (e.target === overlayRef.current) close();
          }}
        >
          <button className={styles.close} aria-label="Close viewer" onClick={close}>
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                className={`${styles.nav} ${styles.prev}`}
                aria-label="Previous"
                onClick={prev}
              >
                ‹
              </button>
              <button className={`${styles.nav} ${styles.next}`} aria-label="Next" onClick={next}>
                ›
              </button>
            </>
          )}

          <div className={styles.frame}>
            <Image
              key={idx}
              src={images[idx]}
              alt={`Image ${idx + 1} of ${images.length}`}
              fill
              priority
              className={styles.fullImg}
              sizes="100vw"
            />
            {images.length > 1 && (
              <div className={styles.count} aria-hidden="true">
                {idx + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

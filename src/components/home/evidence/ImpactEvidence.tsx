// src/components/home/evidence/ImpactEvidence.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './ImpactEvidence.module.scss';

export type EvidenceItem =
  | {
      type: 'image';
      src: string;
      alt?: string;
      title?: string;
      caption?: string;
      date?: string; // "Jan 2026" etc (display only)
      location?: string;
    }
  | {
      type: 'video';
      src: string; // mp4/webm public or remote
      poster?: string; // strongly recommended for reel + grid
      title?: string;
      caption?: string;
      date?: string;
      location?: string;
    };

type Props = {
  id?: string;
  title?: string;
  subtitle?: string;
  stats?: Array<{ label: string; value: string }>;
  items: EvidenceItem[];
  intervalMs?: number;
  ctaLabel?: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

export default function ImpactEvidence({
  id = 'impact-evidence',
  title = 'Evidence of Where Your Money Has Been Helping',
  subtitle = 'Real updates from the ground — photos and video moments showing progress and impact.',
  stats = [
    { label: 'Community updates', value: 'Monthly' },
    { label: 'Media proof', value: 'Photos + Videos' },
    { label: 'Transparency', value: 'Always on-site' },
  ],
  items,
  intervalMs = 5200,
  ctaLabel = 'View all evidence',
}: Props) {
  const reducedMotion = usePrefersReducedMotion();

  // ✅ Memoize so ESLint deps don't fluctuate
  const safeItems = useMemo(() => items ?? [], [items]);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Modal / Viewer state
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIdx, setViewerIdx] = useState(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return safeItems;
    return safeItems.filter((i) => i.type === filter);
  }, [safeItems, filter]);

  const reelItem = safeItems[active];

  // autoplay reel
  useEffect(() => {
    if (reducedMotion) return;
    if (!safeItems.length) return;
    if (paused) return;

    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % safeItems.length);
    }, intervalMs);

    return () => window.clearInterval(t);
  }, [safeItems.length, intervalMs, paused, reducedMotion]);

  const go = useCallback(
    (idx: number) => {
      if (!safeItems.length) return;
      const n = ((idx % safeItems.length) + safeItems.length) % safeItems.length;
      setActive(n);
    },
    [safeItems.length]
  );

  const next = useCallback(() => go(active + 1), [go, active]);
  const prev = useCallback(() => go(active - 1), [go, active]);

  // keyboard for modal/viewer
  useEffect(() => {
    if (!modalOpen && !viewerOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewerOpen) setViewerOpen(false);
        else setModalOpen(false);
      }
      if (!viewerOpen) return;

      if (e.key === 'ArrowRight') setViewerIdx((i) => (i + 1) % filtered.length);
      if (e.key === 'ArrowLeft') setViewerIdx((i) => (i - 1 + filtered.length) % filtered.length);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, viewerOpen, filtered.length]);

  // swipe for viewer
  useEffect(() => {
    if (!viewerOpen || !overlayRef.current) return;
    let startX = 0;
    const el = overlayRef.current;

    const onTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 40) setViewerIdx((i) => (i - 1 + filtered.length) % filtered.length);
      if (dx < -40) setViewerIdx((i) => (i + 1) % filtered.length);
    };

    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [viewerOpen, filtered.length]);

  // lock scroll when modal open
  useEffect(() => {
    if (!modalOpen && !viewerOpen) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [modalOpen, viewerOpen]);

  const openModal = () => {
    setModalOpen(true);
    setViewerOpen(false);
    setFilter('all');
  };

  const openViewerAt = (idx: number) => {
    setViewerIdx(idx);
    setViewerOpen(true);
  };

  const viewerItem = filtered[viewerIdx];

  return (
    <section
      id={id}
      className={styles.section}
      aria-label="Evidence of impact section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container">
        <div className={styles.wrap}>
          {/* Left */}
          <div className={styles.copy}>
            <span className={styles.kicker}>Impact Evidence</span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>

            <div className={styles.stats} aria-label="Impact highlights">
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <div className={styles.value}>{s.value}</div>
                  <div className={styles.label}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <button className={styles.primary} onClick={openModal}>
                {ctaLabel}
              </button>

              <button
                className={styles.secondary}
                onClick={() => {
                  setModalOpen(true);
                  setFilter('all');
                  setTimeout(() => {
                    if (!safeItems.length) return;
                    openViewerAt(active);
                  }, 0);
                }}
                disabled={!safeItems.length}
              >
                Watch / view current
              </button>
            </div>

            <p className={styles.note}>
              We publish evidence media so supporters can see exactly where funds are being used.
            </p>
          </div>

          {/* Right: Reel */}
          <div className={styles.reel} aria-label="Impact reel">
            {safeItems.length === 0 ? (
              <div className={styles.reelEmpty}>
                No evidence media yet — upload from Admin <strong>Home → Evidence</strong>.
              </div>
            ) : (
              <div className={styles.stage}>
                <div className={styles.media}>
                  {reelItem?.type === 'image' ? (
                    <Image
                      src={reelItem.src}
                      alt={reelItem.alt ?? 'Impact evidence image'}
                      fill
                      className={styles.cover}
                      sizes="(max-width: 900px) 100vw, 52vw"
                      priority={active === 0}
                    />
                  ) : (
                    <>
                      {reelItem?.poster ? (
                        <Image
                          src={reelItem.poster}
                          alt="Impact evidence video poster"
                          fill
                          className={styles.cover}
                          sizes="(max-width: 900px) 100vw, 52vw"
                        />
                      ) : (
                        <div className={styles.videoFallback}>Video</div>
                      )}
                      <div className={styles.playBadge} aria-hidden="true">
                        ▶
                      </div>
                    </>
                  )}

                  <div className={styles.gradient} aria-hidden="true" />

                  <div className={styles.meta}>
                    <div className={styles.metaTop}>
                      {reelItem?.location ? (
                        <span className={styles.pill}>{reelItem.location}</span>
                      ) : null}
                      {reelItem?.date ? <span className={styles.pill}>{reelItem.date}</span> : null}
                      <span className={styles.pill}>
                        {reelItem?.type === 'video' ? 'Video' : 'Photo'}
                      </span>
                    </div>

                    {reelItem?.title ? (
                      <div className={styles.metaTitle}>{reelItem.title}</div>
                    ) : null}
                    {reelItem?.caption ? (
                      <div className={styles.metaCaption}>{reelItem.caption}</div>
                    ) : null}
                  </div>

                  <button
                    className={styles.stageClick}
                    onClick={() => {
                      setModalOpen(true);
                      setFilter('all');
                      openViewerAt(active);
                    }}
                    aria-label="Open this evidence item"
                  />
                </div>

                <div className={styles.controls}>
                  <button className={styles.arrow} onClick={prev} aria-label="Previous">
                    ‹
                  </button>

                  <div className={styles.dots} aria-label="Reel position">
                    {safeItems.map((_, i) => (
                      <button
                        key={i}
                        className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                        onClick={() => go(i)}
                        aria-label={`Go to item ${i + 1}`}
                        aria-current={i === active ? 'true' : 'false'}
                      />
                    ))}
                  </div>

                  <button className={styles.arrow} onClick={next} aria-label="Next">
                    ›
                  </button>
                </div>

                <div className={styles.reelFooter}>
                  <span className={styles.count}>
                    {active + 1} / {safeItems.length}
                  </span>
                  <span className={styles.hint}>Hover to pause • Click media to open</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal (Grid) */}
      {modalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="All evidence media"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false);
              setViewerOpen(false);
            }
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalHead}>
              <div>
                <div className={styles.modalTitle}>All Evidence</div>
                <div className={styles.modalSub}>
                  Photos and videos — transparency updates. Click any item to view.
                </div>
              </div>

              <button
                className={styles.modalClose}
                aria-label="Close"
                onClick={() => {
                  setModalOpen(false);
                  setViewerOpen(false);
                }}
              >
                ✕
              </button>
            </div>

            <div className={styles.filters} role="tablist" aria-label="Evidence filters">
              <button
                className={`${styles.chip} ${filter === 'all' ? styles.chipActive : ''}`}
                onClick={() => setFilter('all')}
                role="tab"
                aria-selected={filter === 'all'}
              >
                All
              </button>
              <button
                className={`${styles.chip} ${filter === 'image' ? styles.chipActive : ''}`}
                onClick={() => setFilter('image')}
                role="tab"
                aria-selected={filter === 'image'}
              >
                Photos
              </button>
              <button
                className={`${styles.chip} ${filter === 'video' ? styles.chipActive : ''}`}
                onClick={() => setFilter('video')}
                role="tab"
                aria-selected={filter === 'video'}
              >
                Videos
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.modalEmpty}>No items in this filter yet.</div>
            ) : (
              <div className={styles.grid} role="list">
                {filtered.map((it, i) => (
                  <button
                    key={i}
                    role="listitem"
                    className={styles.tile}
                    onClick={() => openViewerAt(i)}
                    aria-label={`Open item ${i + 1}`}
                  >
                    {it.type === 'image' ? (
                      <Image
                        src={it.src}
                        alt={it.alt ?? `Evidence photo ${i + 1}`}
                        width={640}
                        height={480}
                        className={styles.thumb}
                        sizes="(max-width: 700px) 100vw, 33vw"
                      />
                    ) : (
                      <div className={styles.videoTile}>
                        {it.poster ? (
                          <Image
                            src={it.poster}
                            alt="Evidence video poster"
                            width={640}
                            height={480}
                            className={styles.thumb}
                            sizes="(max-width: 700px) 100vw, 33vw"
                          />
                        ) : (
                          <div className={styles.videoFallback}>Video</div>
                        )}
                        <span className={styles.playMini} aria-hidden="true">
                          ▶
                        </span>
                      </div>
                    )}

                    {(it.title || it.caption || it.location || it.date) && (
                      <div className={styles.tileMeta}>
                        <div className={styles.tileRow}>
                          {it.location ? <span className={styles.tag}>{it.location}</span> : null}
                          {it.date ? <span className={styles.tag}>{it.date}</span> : null}
                          <span className={styles.tag}>
                            {it.type === 'video' ? 'Video' : 'Photo'}
                          </span>
                        </div>
                        {it.title ? <div className={styles.tileTitle}>{it.title}</div> : null}
                        {it.caption ? <div className={styles.tileCaption}>{it.caption}</div> : null}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Viewer Lightbox */}
          {viewerOpen && viewerItem && (
            <div
              ref={overlayRef}
              className={styles.viewerOverlay}
              role="dialog"
              aria-modal="true"
              aria-label="Evidence viewer"
              onClick={(e) => {
                if (e.target === e.currentTarget) setViewerOpen(false);
              }}
            >
              <button
                className={styles.viewerClose}
                aria-label="Close viewer"
                onClick={() => setViewerOpen(false)}
              >
                ✕
              </button>

              {filtered.length > 1 && (
                <>
                  <button
                    className={`${styles.viewerNav} ${styles.viewerPrev}`}
                    aria-label="Previous"
                    onClick={() => setViewerIdx((i) => (i - 1 + filtered.length) % filtered.length)}
                  >
                    ‹
                  </button>
                  <button
                    className={`${styles.viewerNav} ${styles.viewerNext}`}
                    aria-label="Next"
                    onClick={() => setViewerIdx((i) => (i + 1) % filtered.length)}
                  >
                    ›
                  </button>
                </>
              )}

              <div className={styles.viewerFrame}>
                {viewerItem.type === 'image' ? (
                  <Image
                    key={viewerIdx}
                    src={viewerItem.src}
                    alt={viewerItem.alt ?? `Evidence image ${viewerIdx + 1}`}
                    fill
                    priority
                    className={styles.viewerImg}
                    sizes="100vw"
                  />
                ) : (
                  <video
                    key={viewerIdx}
                    className={styles.viewerVideo}
                    controls
                    playsInline
                    preload="metadata"
                    poster={viewerItem.poster}
                  >
                    <source src={viewerItem.src} />
                    Your browser does not support the video tag.
                  </video>
                )}

                <div className={styles.viewerBottom}>
                  <div className={styles.viewerCount}>
                    {viewerIdx + 1} / {filtered.length}
                  </div>

                  {(viewerItem.title ||
                    viewerItem.caption ||
                    viewerItem.location ||
                    viewerItem.date) && (
                    <div className={styles.viewerMeta}>
                      <div className={styles.viewerRow}>
                        {viewerItem.location ? (
                          <span className={styles.tag}>{viewerItem.location}</span>
                        ) : null}
                        {viewerItem.date ? (
                          <span className={styles.tag}>{viewerItem.date}</span>
                        ) : null}
                        <span className={styles.tag}>
                          {viewerItem.type === 'video' ? 'Video' : 'Photo'}
                        </span>
                      </div>
                      {viewerItem.title ? (
                        <div className={styles.viewerTitle}>{viewerItem.title}</div>
                      ) : null}
                      {viewerItem.caption ? (
                        <div className={styles.viewerCaption}>{viewerItem.caption}</div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

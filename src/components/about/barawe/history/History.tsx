'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './History.module.scss';
import historyData, { type HistoryEntry, type IconKey } from './historyData';
import { TbBooks, TbSailboat, TbFeather, TbUsers, TbWaveSine } from 'react-icons/tb';

const ICONS: Record<IconKey, React.ReactNode> = {
  books: <TbBooks aria-hidden />,
  sail: <TbSailboat aria-hidden />,
  feather: <TbFeather aria-hidden />,
  users: <TbUsers aria-hidden />,
  history: <TbWaveSine aria-hidden />,
};

export default function History() {
  const [active, setActive] = useState(historyData[0].id);
  const [expanded, setExpanded] = useState(false);

  // Top of section ref (for scroll-back)
  const topRef = useRef<HTMLElement | null>(null);

  const current = historyData.find((item) => item.id === active) as HistoryEntry;

  // Split body into blocks separated by blank lines
  const blocks = (current.body || '')
    .split('\n\n')
    .map((b) => b.trim())
    .filter(Boolean);

  const hasMore = blocks.length > 2;
  const visibleBlocks = !hasMore || expanded ? blocks : blocks.slice(0, 2);

  const isImageBlock = (block: string) => block.toLowerCase().startsWith('image:');

  // Turn visibleBlocks into renderable React nodes, combining
  // "image + next text" into a side-by-side row when appropriate
  const renderedBlocks: React.ReactNode[] = [];
  for (let i = 0; i < visibleBlocks.length; i++) {
    const block = visibleBlocks[i];

    // IMAGE + TEXT ROW
    if (
      isImageBlock(block) &&
      i + 1 < visibleBlocks.length &&
      !isImageBlock(visibleBlocks[i + 1])
    ) {
      const raw = block.split(':')[1]?.trim() ?? '';
      const src = raw.startsWith('public/')
        ? `/${raw.replace(/^public\//, '')}`
        : raw.startsWith('/')
          ? raw
          : `/${raw}`;
      const text = visibleBlocks[i + 1];

      renderedBlocks.push(
        <div key={`row-${i}`} className={styles.imageRow}>
          <figure className={styles.imageRowFigure}>
            <Image
              src={src}
              alt={current.title}
              fill
              className={styles.imageRowImage}
              sizes="(max-width: 768px) 100vw, 260px"
            />
          </figure>
          <div className={styles.imageRowText}>
            <p className={styles.paragraph}>{text}</p>
          </div>
        </div>
      );

      i++; // skip the text block we just consumed
      continue;
    }

    // STANDALONE IMAGE (full-width)
    if (isImageBlock(block)) {
      const raw = block.split(':')[1]?.trim() ?? '';
      const src = raw.startsWith('public/')
        ? `/${raw.replace(/^public\//, '')}`
        : raw.startsWith('/')
          ? raw
          : `/${raw}`;

      renderedBlocks.push(
        <figure key={`img-${i}`} className={styles.imageBlock}>
          <Image
            src={src}
            alt={current.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </figure>
      );
      continue;
    }

    // NORMAL PARAGRAPH
    renderedBlocks.push(
      <p key={`p-${i}`} className={styles.paragraph}>
        {block}
      </p>
    );
  }

  function collapseAndScroll() {
    setExpanded(false);
    setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  return (
    <section ref={topRef} className={styles.wrap} aria-labelledby="history-heading">
      <header className={styles.header}>
        <span className={styles.kicker}>History & Heritage</span>
        <h2 id="history-heading">
          The Story of <span className={styles.highlight}>Baraawe</span>
        </h2>
        <p>
          From early Swahili trade networks to modern diaspora — explore the story of a resilient
          coastal city.
        </p>
      </header>

      <div className={styles.layout}>
        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          {historyData.map(({ id, title, icon }) => (
            <button
              key={id}
              className={`${styles.tab} ${id === active ? styles.active : ''}`}
              onClick={() => {
                setActive(id);
                setExpanded(false);
                setTimeout(() => {
                  topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              aria-pressed={id === active}
            >
              <span className={styles.icon}>{ICONS[icon]}</span>
              <span>{title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <article
          className={`${styles.content} ${expanded ? styles.contentExpanded : ''}`}
          role="tabpanel"
          aria-live="polite"
        >
          <h3 className={styles.title}>{current.title}</h3>
          <p className={styles.summary}>{current.summary}</p>

          <div className={styles.body}>{renderedBlocks}</div>

          {!expanded && hasMore && (
            <button className={styles.readMore} onClick={() => setExpanded(true)}>
              Read more →
            </button>
          )}

          {expanded && hasMore && (
            <button className={styles.readLess} onClick={collapseAndScroll}>
              Show less ↑
            </button>
          )}

          {current.source && (
            <p className={styles.sourceLink}>
              <a href={current.source.href} target="_blank" rel="noopener noreferrer">
                Read more at {current.source.label} ↗
              </a>
            </p>
          )}
        </article>
      </div>
    </section>
  );
}

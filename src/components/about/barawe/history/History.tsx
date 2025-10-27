'use client';

import { useState } from 'react';
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
  const current = historyData.find((item) => item.id === active) as HistoryEntry;

  const previewText = current.body.split('\n\n').slice(0, 2);
  const fullText = current.body.split('\n\n');

  return (
    <section className={styles.wrap} aria-labelledby="history-heading">
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
        <div className={styles.tabs} role="tablist">
          {historyData.map(({ id, title, icon }) => (
            <button
              key={id}
              className={`${styles.tab} ${id === active ? styles.active : ''}`}
              onClick={() => {
                setActive(id);
                setExpanded(false);
              }}
              aria-pressed={id === active}
            >
              <span className={styles.icon}>{ICONS[icon]}</span>
              <span>{title}</span>
            </button>
          ))}
        </div>

        {/* CONTENT — no card; clean, open background */}
        <article className={styles.content} role="tabpanel" aria-live="polite">
          <h3 className={styles.title}>{current.title}</h3>
          <p className={styles.summary}>{current.summary}</p>
          <div className={styles.body}>
            {(expanded ? fullText : previewText).map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {!expanded && fullText.length > 2 && (
            <button className={styles.readMore} onClick={() => setExpanded(true)}>
              Read more →
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

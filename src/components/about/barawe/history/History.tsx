'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './History.module.scss';

type Era = {
  key: string;
  label: string;
  summary: string;
  detail: string;
  href: string;
  source: string;
};

const ERAS: Era[] = [
  {
    key: 'early',
    label: 'Early City (11th–15th c.)',
    summary:
      'Archaeology and inscriptions (1104, 1398) place Brava among the early Swahili towns linked to the Indian Ocean world.',
    detail:
      'Discoveries of glazed pottery, funerary inscriptions, and mosque carvings reveal Brava’s integration into the early Swahili world. The people spoke Chimiini — a dialect preserving ancient Swahili forms — and maintained ties with Pate, Kilwa, and Yemen. Al-Idrisi described it as a mixed yet thriving Islamic port.',
    href: 'https://www.africanhistoryextra.com/p/the-complete-history-of-brava-ca',
    source: 'African History Extra',
  },
  {
    key: 'republic',
    label: 'Republic & Trade (16th–18th c.)',
    summary:
      'Governed by councils of elders like other Swahili cities, Brava prospered through trade despite attacks and shifting alliances.',
    detail:
      'Portuguese incursions in 1506 failed to hold the city. Brava rebuilt quickly, remaining a stopover for Indian Ocean merchants. The city’s shipowners traded ivory and textiles with Pate, Yemen, and Surat. Governance by an oligarchic council of elders reflected its independence and sophistication.',
    href: 'https://www.africanhistoryextra.com/p/the-complete-history-of-brava-ca',
    source: 'African History Extra',
  },
  {
    key: 'scholars',
    label: 'Scholars & Language (18th–19th c.)',
    summary:
      'Brava became a centre of learning — producing poets and jurists writing in Chimiini and Arabic.',
    detail:
      'Prominent figures like Uways al-Barawi, Muhyi ad-Din, and Dada Masiti linked Brava’s scholarship with Zanzibar and the Hejaz. The city’s Qadiriyya poets used literature as resistance against colonial rule, preserving Chimiini as a vibrant intellectual language.',
    href: 'https://en.wikipedia.org/wiki/Barawa',
    source: 'Wikipedia',
  },
  {
    key: 'lineage',
    label: 'Lineages & Local Ties',
    summary:
      'Oral traditions highlight the Tunni as founders, later joined by Hatimi and Ashraf lineages — creating a cosmopolitan identity.',
    detail:
      'The Tunni clan established the first settlements under Aw-Ali. Centuries later, Hatimi families from Yemen and Ashraf scholars arrived and intermarried with locals. These blended lineages forged a distinct Bravanese culture — “Waantu wa Miini,” the People of Brava.',
    href: 'https://baraawelandstategov.wordpress.com/2015/03/07/baraawe-history/',
    source: 'Baraawe News',
  },
  {
    key: 'recent',
    label: 'Recent History (19th–21st c.)',
    summary:
      'From Sufi scholarship to colonial transitions and modern revival, Brava continues to embody resilience.',
    detail:
      'In the 1800s, Brava thrived under local elders and Sufi scholars before becoming part of Italian Somaliland in 1893. The 20th century brought decline and conflict, but also cultural revival. Today, it stands as the capital of South West State — still known for peace, education, and coastal trade.',
    href: 'https://en.wikipedia.org/wiki/Barawa',
    source: 'Wikipedia',
  },
];

export default function History() {
  const [active, setActive] = useState<Era>(ERAS[0]);

  return (
    <section className={styles.wrap} aria-labelledby="history-heading">
      <div className={styles.header}>
        <span className={styles.kicker}>History & Heritage</span>
        <h2 id="history-heading" className={styles.h2}>
          The Story of Baraawe
        </h2>
        <p className={styles.sub}>
          A Swahili–Somali city shaped by trade, scholarship, and enduring community.
        </p>
      </div>

      <nav className={styles.tabs} aria-label="Timeline navigation">
        {ERAS.map((era) => (
          <button
            key={era.key}
            onClick={() => setActive(era)}
            className={`${styles.tab} ${active.key === era.key ? styles.active : ''}`}
          >
            {era.label}
          </button>
        ))}
      </nav>

      <article key={active.key} className={`${styles.content} reveal-up`}>
        <h3 className={styles.contentHeading}>{active.label}</h3>
        <p className={styles.detail}>{active.detail}</p>
        <Link
          href={active.href}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.readmore}
        >
          Read more at {active.source} →
        </Link>
      </article>
    </section>
  );
}

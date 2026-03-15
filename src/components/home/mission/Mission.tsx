// src/components/home/mission/Mission.tsx
'use client';

import React from 'react';
import styles from './Mission.module.scss';
import Link from 'next/link';
import { FaHome, FaBookOpen, FaHandsHelping, FaHeartbeat, FaArrowRight } from 'react-icons/fa';
import { useCountUpOnView } from '@/lib/hooks/useCountUpOnView';

export type MissionStats = {
  familiesHoused?: number;
  childrenInCare?: number;
  mealsServed?: number;
};

type MissionProps = {
  id?: string;
  donateHref?: string;
  stats?: MissionStats;
};

function Stat({ label, value }: { label: string; value: number }) {
  const { ref, value: animated } = useCountUpOnView(value, 900, 14);
  const strongRef = ref as React.RefObject<HTMLElement>;

  return (
    <div className={styles.stat}>
      <strong ref={strongRef} aria-label={`${value} ${label.toLowerCase()}`}>
        {animated.toLocaleString()}
      </strong>
      <span>{label}</span>
    </div>
  );
}

export default function Mission({
  id = 'mission',
  donateHref = '/donate',
  stats = { familiesHoused: 580, childrenInCare: 380, mealsServed: 7000 },
}: MissionProps) {
  const { familiesHoused = 580, childrenInCare = 380, mealsServed = 7000 } = stats;

  const cards = [
    {
      icon: <FaHome aria-hidden="true" />,
      title: 'Provide Safe Shelter',
      text: 'A secure home for orphans and families in crisis — with clean rooms, dignity, and 24/7 care.',
    },
    {
      icon: <FaBookOpen aria-hidden="true" />,
      title: 'Education & Mentorship',
      text: 'Daily learning support, school placement, tutoring and life-skills so every child can thrive.',
    },
    {
      icon: <FaHandsHelping aria-hidden="true" />,
      title: 'Family Support',
      text: 'Counselling, casework and reunification where safe — rebuilding stability and belonging.',
    },
    {
      icon: <FaHeartbeat aria-hidden="true" />,
      title: 'Nutrition & Health',
      text: 'Reliable meals, clean water, hygiene supplies and access to essential healthcare.',
    },
  ];

  return (
    <section id={id} className={styles.mission} aria-label="Our Mission">
      <div className="container">
        <div className={styles.lead}>
          <span className={styles.kicker}>Our Mission</span>
          <h2>Hope, Home, and a Path to the Future</h2>
          <p>
            We&#39;re building a safe haven in Baraawe/Brava, a place where vulnerable children and
            families can live, learn and heal. Your generosity turns empty nights into warm beds,
            hunger into meals, and uncertainty into possibilities.
          </p>
        </div>

        <div className={styles.grid} role="list">
          {cards.map((c, i) => (
            <article key={i} role="listitem" className={styles.card}>
              <div className={styles.iconWrap}>{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>

        <div className={styles.impact}>
          <Stat label="Families Housed" value={familiesHoused} />
          <Stat label="Children in Care" value={childrenInCare} />
          <Stat label="Meals Served" value={mealsServed} />
        </div>

        <div className={styles.ctaRow}>
          <Link
            href={donateHref}
            className={styles.cta}
            aria-label="Donate to provide shelter, education and care"
          >
            Give Shelter &amp; Hope <FaArrowRight aria-hidden="true" />
          </Link>
          <p className={styles.note}>
            100% of your gift funds housing, education and care on the ground in Baraawe.
          </p>
        </div>
      </div>
    </section>
  );
}

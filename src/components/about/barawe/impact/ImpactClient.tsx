// src/components/about/barawe/impact/ImpactClient.tsx
'use client';

import { Building, Baby, BookOpen, Hammer } from 'lucide-react';
import styles from './Impact.module.scss';

const items = [
  {
    icon: <Building size={20} />,
    text: '20,000+ people live in displacement camps around the city',
  },
  {
    icon: <Baby size={20} />,
    text: 'Many children are orphaned or raised by single parents with no income',
  },
  {
    icon: <BookOpen size={20} />,
    text: 'Access to formal education is extremely limited — most youth have never attended school',
  },
  {
    icon: <Hammer size={20} />,
    text: 'Job training in essential skills like sewing, carpentry, fishing, or cooking is rare',
  },
];

export default function ImpactClient() {
  return (
    <div className={styles.impactContent}>
      <p className={styles.intro}>
        After years of conflict and instability, although the city is finally rebuilding, thousands
        still face daily hardship. Vulnerable families, orphans, and youth continue to lack basic
        support and opportunity.
      </p>

      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.text}>{item.text}</span>
          </li>
        ))}
      </ul>

      <p className={styles.closing}>
        Without education or vocational pathways, the next generation risks being left behind.
        Despite the resilience of the community, real progress for the most vulnerable depends on
        targeted support and long-term investment.
      </p>
      {/* 
      <a href="#support" className={styles.cta}>
        See how we’re helping Baraawe rebuild — one life at a time. →
      </a> */}
    </div>
  );
}

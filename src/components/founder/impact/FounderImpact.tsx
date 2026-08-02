'use client';

import { motion } from 'framer-motion';
import styles from './FounderImpact.module.scss';

const impactHighlights = [
  {
    label: 'Education',
    title: 'Learning for children who would otherwise miss school',
    body: 'Support goes toward school access, books, supplies and the day-to-day essentials that help vulnerable children keep learning.',
  },
  {
    label: 'Meals',
    title: 'Breakfast and food support where hunger is real',
    body: 'Children cannot learn on an empty stomach. A key part of the work is helping make sure meals are available when families are struggling.',
  },
  {
    label: 'Community livelihoods',
    title: 'Practical work that strengthens families too',
    body: 'The wider vision includes creating opportunities for local teachers, women learning sewing skills, and men receiving carpentry support.',
  },
];

export default function FounderImpact() {
  return (
    <section id="donate" className={styles.impactSection} aria-labelledby="founder-impact-heading">
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className={styles.copy}>
          <span className={styles.kicker}>What the work looks like today</span>

          <h2 id="founder-impact-heading" className={styles.heading}>
            More than charity,{' '}
            <span className={styles.highlight}>a small but growing community lifeline.</span>
          </h2>

          <p className={styles.lead}>
            This work is not only about one building. It is about creating a place where children
            can learn, eat and feel safe, while families around them become more stable and more
            hopeful.
          </p>

          <ul className={styles.principles} aria-label="Current areas of work">
            <li>
              <strong>Education for vulnerable children.</strong> Helping children stay connected to
              learning even when home circumstances are difficult.
            </li>
            <li>
              <strong>Daily food support.</strong> Providing breakfast and practical help for
              children who arrive hungry.
            </li>
            <li>
              <strong>Safe homes for orphaned children.</strong> Building rooms, beds and daily care
              for children who have nowhere else to go.
            </li>
            <li>
              <strong>Economic dignity.</strong> Looking beyond relief alone by supporting work,
              skills and opportunities inside the community.
            </li>
          </ul>

          <div className={styles.actions}>
            <a href="/contact" className={styles.primary}>
              Ask how to support the work
            </a>
            <p className={styles.note}>
              Support is meant to be practical and personal. If you want to help with meals,
              education, family support or a community need, you can reach out directly.
            </p>
          </div>
        </div>

        <div className={styles.grid} aria-label="Examples of current focus">
          {impactHighlights.map((item) => (
            <article key={item.label} className={styles.card}>
              <p className={styles.label}>{item.label}</p>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.body}>{item.body}</p>
            </article>
          ))}

          <div className={styles.smallPrint}>
            The exact needs change over time, but the purpose stays consistent: protect children,
            strengthen families, and rebuild dignity from within the community.
          </div>
        </div>
      </motion.div>
    </section>
  );
}

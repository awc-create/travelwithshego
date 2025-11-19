'use client';

import styles from './FounderImpact.module.scss';

const impactHighlights = [
  {
    label: 'Education',
    title: 'School fees & learning essentials',
    body: 'Helping children stay in class by covering fees, uniforms, books and exam costs when families can’t manage alone.',
  },
  {
    label: 'Safe homes',
    title: 'Support for orphans & vulnerable families',
    body: 'Quietly assisting carers and single parents with rent, food and basics so children can stay in safe, stable homes.',
  },
  {
    label: 'Community projects',
    title: 'Wells & local initiatives',
    body: 'Backing small, community-led projects such as wells, repairs and local relief where they are needed most.',
  },
];

export default function FounderImpact() {
  return (
    <section id="donate" className={styles.impactSection} aria-labelledby="founder-impact-heading">
      <div className={styles.inner}>
        {/* LEFT – explanation + trust */}
        <div className={styles.copy}>
          <span className={styles.kicker}>Where your support goes</span>
          <h2 id="founder-impact-heading" className={styles.heading}>
            Simple, direct help —{' '}
            <span className={styles.highlight}>sent through trusted hands in Somalia.</span>
          </h2>

          <p className={styles.lead}>
            There is no big charity machine here. Support that comes through Travel with Shego is
            passed on carefully: to families, carers and local leaders who know the streets, the
            schools and the real needs. Every contribution is treated as amanah — a trust.
          </p>

          <ul className={styles.principles} aria-label="How Shego handles funds">
            <li>
              <strong>Local first.</strong> Money goes to people who live in the communities
              affected, not distant offices.
            </li>
            <li>
              <strong>Quiet by design.</strong> No public fundraising targets or pressure — just
              steady, discreet support.
            </li>
            <li>
              <strong>Accountable.</strong> Shego keeps personal records, voice notes and updates
              from the ground to track how help is used.
            </li>
          </ul>

          <div className={styles.actions}>
            <a href="/contact" className={styles.primary}>
              Ask about supporting a project
            </a>
            <p className={styles.note}>
              You&apos;re welcome to reach out if you want to help with school fees, a well, or a
              specific family situation. Support is arranged personally, case by case.
            </p>
          </div>
        </div>

        {/* RIGHT – impact cards */}
        <div className={styles.grid} aria-label="Examples of current focus">
          {impactHighlights.map((item) => (
            <article key={item.label} className={styles.card}>
              <p className={styles.label}>{item.label}</p>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.body}>{item.body}</p>
            </article>
          ))}

          <div className={styles.smallPrint}>
            These are typical areas of support. Needs change over time, but the aim stays the same:
            protect children, keep families stable and make daily life a little easier for people
            who have very little.
          </div>
        </div>
      </div>
    </section>
  );
}

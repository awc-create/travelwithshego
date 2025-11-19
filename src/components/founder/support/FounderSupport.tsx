'use client';

import styles from './FounderSupport.module.scss';

export default function FounderSupport() {
  return (
    <section className={styles.supportSection} aria-labelledby="founder-support-heading">
      <div className={styles.inner}>
        {/* HEADER / INTRO */}
        <header className={styles.header}>
          <span className={styles.kicker}>Standing with Shego</span>
          <h2 id="founder-support-heading" className={styles.heading}>
            You don&apos;t have to be on stage to{' '}
            <span className={styles.highlight}>keep this work going.</span>
          </h2>
          <p className={styles.lead}>
            These days, most of Shego&apos;s work happens quietly: supporting families, guiding
            young people and staying connected with trusted contacts in Somalia. If you want to
            help, there are simple, steady ways to do it.
          </p>
        </header>

        {/* GRID OF WAYS TO HELP */}
        <div className={styles.grid} aria-label="Ways you can support">
          <article className={styles.card}>
            <p className={styles.label}>1 · Share the stories</p>
            <h3 className={styles.title}>Amplify Baraawe&apos;s voice</h3>
            <p className={styles.body}>
              Sharing Travel with Shego videos, interviews or posts helps more people understand
              what life looks like for Somali families, both at home and in the diaspora. Awareness
              makes it easier to gather quiet support when it is needed.
            </p>
            <p className={styles.detail}>
              You can start with the{' '}
              <a
                href="https://www.youtube.com/@shegomedia"
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                Travel With Shego YouTube channel
              </a>
              , or simply tell someone else about the work.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>2 · Back a practical need</p>
            <h3 className={styles.title}>Help with fees, housing or a well</h3>
            <p className={styles.body}>
              From school fees to rent top-ups or small community projects like wells, even modest
              contributions can make a real difference when they&apos;re directed carefully and
              locally.
            </p>
            <p className={styles.detail}>
              If you&apos;re thinking about helping in this way, you can reach out and ask about
              current needs rather than giving into a general pot.
            </p>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>3 · Open doors for young people</p>
            <h3 className={styles.title}>Mentoring, guidance & opportunities</h3>
            <p className={styles.body}>
              Many young people in the diaspora carry big responsibilities at home while trying to
              study or build careers. Offering mentoring, work experience, or simply time and advice
              can be just as valuable as money.
            </p>
            <p className={styles.detail}>
              If you have skills, networks or experience that could help, you can get in touch and
              explore what might be useful and realistic.
            </p>
          </article>
        </div>

        {/* FOOTER NOTE + CTA */}
        <footer className={styles.footer}>
          <p className={styles.note}>
            None of this is about building a celebrity brand or constant fundraising. It&apos;s
            about steady, respectful support — the kind that protects dignity and keeps
            Baraawe&apos;s spirit alive in a quiet way.
          </p>
          <a href="/contact" className={styles.primary}>
            Start a private conversation
          </a>
        </footer>
      </div>
    </section>
  );
}

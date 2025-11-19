'use client';

import styles from './FounderStory.module.scss';

interface FounderStoryProps {
  onScrollToDonate?: () => void;
}

export default function FounderStory({ onScrollToDonate }: FounderStoryProps) {
  const handleDonateClick = () => {
    if (onScrollToDonate) {
      onScrollToDonate();
      return;
    }
    const donate = document.querySelector('#donate');
    if (donate instanceof HTMLElement) {
      donate.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className={styles.storySection}
      data-founder-scroll-target
      aria-labelledby="founder-story-heading"
    >
      <div className={styles.inner}>
        {/* LEFT – narrative */}
        <div>
          <span className={styles.kicker}>From Brava to Toronto</span>
          <h2 id="founder-story-heading" className={styles.heading}>
            How one band became a{' '}
            <span className={styles.highlight}>bridge for Somali culture.</span>
          </h2>

          <p className={styles.lead}>
            The story starts in Brava (Baraawe), where a young Shego first picked up the guitar. In
            the 1980s he and his brother Said moved through Saudi Arabia, Egypt and the United
            States before finally settling in Toronto in 1991 — carrying Somali songs, rhythms and
            stories with them the whole way.
          </p>

          <div className={styles.body}>
            <p>
              In Toronto, that journey became ShegoBand: an energetic ensemble blending Somali dance
              music, hip-hop, soul and jazz-influenced arrangements, with lyrics in Somali, Arabic,
              Swahili and more. Most of the musicians were professionals and producers, able to
              craft a sound that felt modern while still rooted in Somalia&apos;s traditional
              rhythms.
            </p>
            <p>
              Over time, the work expanded. Shego produced and recorded Somali artists in the
              diaspora, helping to keep a scattered culture connected. Tours like Arts Midwest World
              Fest in 2005–2006 brought ShegoBand, Hibo Nuur and Kooshin to new audiences — offering
              a living taste of Somali music and history at a time when many people only heard about
              the country through war.
            </p>
            <p>
              Today, Shego isn&apos;t chasing stages. The focus is on what those years created: an
              archive of music, a community that still knows his name, and a commitment to quietly
              support orphans, education and families in Somalia through the platform he built.
            </p>
          </div>
        </div>

        {/* RIGHT – simple timeline / phases */}
        <aside className={styles.timeline} aria-label="How the work has grown">
          <p className={styles.pillLabel}>How the journey unfolded</p>

          <div className={styles.eventCard}>
            <span className={styles.eventMeta}>1 · Roots</span>
            <span className={styles.eventTitle}>Brava, family and the oud</span>
            <p className={styles.eventBody}>
              Childhood in Brava, learning guitar and oud, surrounded by elders&apos; stories and
              the rhythms that would later shape ShegoBand&apos;s sound.
            </p>
          </div>

          <div className={styles.eventCard}>
            <span className={styles.eventMeta}>2 · Diaspora</span>
            <span className={styles.eventTitle}>A long road to Toronto</span>
            <p className={styles.eventBody}>
              Years spent in Saudi Arabia, Egypt and the United States, before settling in Canada in
              1991. The music evolves with every move, but stays rooted in Somali culture.
            </p>
          </div>

          <div className={styles.eventCard}>
            <span className={styles.eventMeta}>3 · ShegoBand & legacy</span>
            <span className={styles.eventTitle}>From live shows to lasting impact</span>
            <p className={styles.eventBody}>
              ShegoBand becomes a name known across the Somali diaspora. Tours, recordings and
              collaborations showcase Somali music to new audiences and help lay the groundwork for
              today&apos;s community projects.
            </p>
          </div>

          <p className={styles.footerNote}>
            When you listen to the music, share it with younger Somalis or{' '}
            <button type="button" className={styles.link} onClick={handleDonateClick}>
              give directly
            </button>
            , you&apos;re helping that journey continue — honouring Shego&apos;s work while
            supporting children and families in Somalia.
          </p>
        </aside>
      </div>
    </section>
  );
}

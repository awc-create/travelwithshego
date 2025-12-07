'use client';

import Image from 'next/image';
import styles from './DonationStories.module.scss';

export const donationStoriesMetadata = {
  title: 'Stories from Baraawe – The Impact of Your Donation',
  description:
    'Read how Donations are helping families, children and teachers in Baraawe through shelter, education and day-to-day support.',
};

type StoryCard = {
  id: string;
  label: string;
  title: string;
  text: string;
  image?: string;
  alt?: string;
};

const stories: StoryCard[] = [
  {
    id: 'shego-quote',
    label: 'From Shego',
    title: '“We see every Donation as a small act of protection.”',
    text: 'For some children in Baraawe, a safe place to sleep and a chance to learn are not guaranteed. Each Donation, no matter the size, helps us protect that space – so children can grow up with more than just survival.',
    image: '/assets/shego-talking.png',
    alt: 'Shego speaking with community members in Baraawe',
  },
  {
    id: 'family-story',
    label: 'Family story',
    title: '“There is one safe corner in the day now.”',
    text: 'One family we support described the school as “the one safe corner in the day” for their children. Your Donations help cover transport, meals and basic supplies so that corner doesn’t disappear.',
    image: '/assets/family-barawe.png',
    alt: 'An anonymised family scene from Baraawe',
  },
  {
    id: 'teacher-quote',
    label: 'Teacher',
    title: '“We can plan lessons, not just survive the term.”',
    text: 'A local teacher told us that steady support means they can plan ahead – not just worry if there will be enough materials for the next week. That stability comes directly from regular Donations.',
    image: '/assets/school-barawe.png',
    alt: 'Teacher working with children in a classroom in Baraawe',
  },
  {
    id: 'thank-you',
    label: 'Thank you',
    title: '“You may never visit Baraawe, but your kindness does.”',
    text: 'Every time someone gives or bids on an item, it sends a quiet message of solidarity. Thank you for choosing to stand with families and children you may never meet in person.',
  },
];

export default function DonationStories() {
  return (
    <section className={styles.wrap} aria-labelledby="donation-stories-heading">
      <div className={styles.inner}>
        <div className={styles.lead}>
          <span className={styles.kicker}>Stories from Baraawe</span>
          <h2 id="donation-stories-heading" className={styles.heading}>
            What your <span className={styles.gold}>Donation</span> makes possible.
          </h2>
          <p className={styles.sub}>
            These are small, anonymised snapshots – shared with care – of how your support is felt
            on the ground.
          </p>
        </div>

        <div className={styles.grid}>
          {stories.map((story) => (
            <article key={story.id} className={styles.card}>
              {story.image && (
                <div className={styles.thumb}>
                  <Image
                    src={story.image}
                    alt={story.alt ?? story.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    className={styles.img}
                  />
                </div>
              )}

              <div className={styles.body}>
                <p className={styles.label}>{story.label}</p>
                <h3 className={styles.title}>{story.title}</h3>
                <p className={styles.text}>{story.text}</p>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.dignityNote}>
          We use photos carefully and avoid sharing names or identifying details, so we can protect
          the dignity and safety of the people we work with.
        </p>
      </div>
    </section>
  );
}

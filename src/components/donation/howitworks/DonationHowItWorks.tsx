'use client';

import styles from './DonationHowItWorks.module.scss';

export const donationHowItWorksMetadata = {
  title: 'How Donations & Bidding Work – Travel with Shego',
  description:
    'A clear explanation of how direct Donations and auction bids are handled – from choosing an amount to sending your gift and receiving your item.',
};

type Step = {
  title: string;
  body: string;
};

const directSteps: Step[] = [
  {
    title: 'Choose your amount',
    body: 'Pick a preset amount or enter your own. You can give once, or set up a monthly Donation to keep support steady.',
  },
  {
    title: 'Complete secure checkout',
    body: 'Payments are processed through our trusted Donation partner using encrypted connections – not over social media or DMs.',
  },
  {
    title: 'Receive your receipt & updates',
    body: 'You’ll get a simple email receipt, and we’ll share occasional updates on how your Donation is being used in Baraawe.',
  },
];

const biddingSteps: Step[] = [
  {
    title: 'Place a bid on any item',
    body: 'Browse the marketplace, check the grading, and place a bid that works for you. You only pay if you win.',
  },
  {
    title: 'Win the auction & receive details',
    body: 'If your bid wins, we confirm by email from our official domain and share the correct Donation account details.',
  },
  {
    title: 'Send your Donation & receive the item',
    body: 'Once the Donation is received, we prepare and ship your item, keeping you updated with tracking wherever possible.',
  },
];

export default function DonationHowItWorks() {
  return (
    <section
      className={styles.wrap}
      aria-labelledby="donation-how-heading"
      aria-describedby="donation-how-sub"
    >
      <div className={styles.inner}>
        <div className={styles.lead}>
          <span className={styles.kicker}>How It Works</span>
          <h2 id="donation-how-heading" className={styles.heading}>
            Two simple ways to <span className={styles.gold}>Donate</span>.
          </h2>
          <p id="donation-how-sub" className={styles.sub}>
            Whether you give directly or bid on items, the process is straightforward, transparent
            and always handled through our official Donation channels.
          </p>
        </div>

        <div className={styles.columns}>
          {/* Direct Donation column */}
          <article className={styles.column}>
            <h3 className={styles.colHeading}>Direct Donation</h3>
            <ol className={styles.list}>
              {directSteps.map((step, index) => (
                <li key={step.title} className={styles.item}>
                  <div className={styles.badge}>{index + 1}</div>
                  <div className={styles.itemBody}>
                    <h4 className={styles.itemTitle}>{step.title}</h4>
                    <p className={styles.itemText}>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          {/* Bid & Donate column */}
          <article className={styles.column}>
            <h3 className={styles.colHeading}>Bid &amp; Donate</h3>
            <ol className={styles.list}>
              {biddingSteps.map((step, index) => (
                <li key={step.title} className={styles.item}>
                  <div className={styles.badge}>{index + 1}</div>
                  <div className={styles.itemBody}>
                    <h4 className={styles.itemTitle}>{step.title}</h4>
                    <p className={styles.itemText}>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        </div>

        <div className={styles.trustBox} aria-label="Donation safety information">
          <p className={styles.trustLine}>
            We <strong>never</strong> send bank details from social media accounts or DMs.
          </p>
          <p className={styles.trustLine}>
            Payments for <span className={styles.gold}>Donations</span> and auction wins are made{' '}
            <strong>only</strong> through our official Donation partner and verified accounts.
          </p>
        </div>
      </div>
    </section>
  );
}

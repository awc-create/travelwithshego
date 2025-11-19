'use client';

import styles from './DonationFAQs.module.scss';

export const donationFAQsMetadata = {
  title: 'Donation & Bidding FAQs – Travel with Shego',
  description:
    'Answers to common questions about Donations, receipts, security, bidding rules, item grading, refunds and shipping.',
};

type FAQ = { q: string; a: string };

const donationFAQ: FAQ[] = [
  {
    q: 'Can I get a receipt?',
    a: 'Yes — every Donation receives a simple email receipt sent immediately after payment.',
  },
  {
    q: 'Are Donations tax-deductible?',
    a: 'At this stage we cannot guarantee tax deductibility. We are working on formal registration for future compliance.',
  },
  {
    q: 'Where does my Donation go?',
    a: 'Directly to shelter support, food, school materials, transport and hygiene kits in Baraawe. No unnecessary admin deductions.',
  },
  {
    q: 'Can I set up monthly giving?',
    a: 'Yes — monthly Donations provide stable support. You can choose monthly during checkout.',
  },
  {
    q: 'Is my payment secure?',
    a: 'Yes — Donations are processed through our official Donation partner using encrypted connections. We never send bank details via social media.',
  },
];

const biddingFAQ: FAQ[] = [
  {
    q: 'How are items graded?',
    a: 'Each device is inspected, test-checked, safely wiped and given a grade: A (Excellent), B (Very Good) or C (Good).',
  },
  {
    q: 'Is there a warranty?',
    a: 'We cannot offer full warranties on Donation-based items, but functional defects are handled case-by-case.',
  },
  {
    q: 'How does shipping work?',
    a: 'Items are shipped via trusted couriers with tracking whenever possible. You’ll receive a dispatch update by email.',
  },
  {
    q: 'When do I pay?',
    a: 'Only when you win an auction. Payment is made through official Donation details sent by email — never through DMs.',
  },
  {
    q: 'What if I can’t pay after winning?',
    a: 'Please contact us as soon as possible. Repeated non-payment causes disruption and may block future bidding.',
  },
];

export default function DonationFAQs() {
  return (
    <section className={styles.wrap} aria-labelledby="donation-faqs-heading">
      <div className={styles.inner}>
        <header className={styles.lead}>
          <span className={styles.kicker}>FAQs</span>

          <h2 id="donation-faqs-heading" className={styles.heading}>
            Common questions about <span className={styles.gold}>Donations</span> &amp; bidding.
          </h2>

          <p className={styles.sub}>
            Straightforward answers to help you feel confident and informed.
          </p>
        </header>

        <div className={styles.columns}>
          {/* Donation FAQs */}
          <div>
            <h3 className={styles.colTitle}>Donation FAQs</h3>

            <div className={styles.accordion}>
              {donationFAQ.map((faq, idx) => (
                <details key={idx} className={styles.item}>
                  <summary className={styles.summary}>{faq.q}</summary>
                  <div className={styles.panel}>
                    <p className={styles.answer}>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Bidding FAQs */}
          <div>
            <h3 className={styles.colTitle}>Bidding FAQs</h3>

            <div className={styles.accordion}>
              {biddingFAQ.map((faq, idx) => (
                <details key={idx} className={styles.item}>
                  <summary className={styles.summary}>{faq.q}</summary>
                  <div className={styles.panel}>
                    <p className={styles.answer}>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

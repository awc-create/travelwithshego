'use client';

import styles from './DonationTrust.module.scss';

export const donationTrustMetadata = {
  title: 'Donation Trust & Safety – Travel with Shego',
  description:
    'Learn how Donations are handled securely: verified accounts, transparent oversight, safe item processing and strict no-cash policies.',
};

export default function DonationTrust() {
  return (
    <section className={styles.wrap} aria-labelledby="donation-trust-heading">
      <div className={styles.inner}>
        <div className={styles.lead}>
          <span className={styles.kicker}>Trust & Transparency</span>
          <h2 id="donation-trust-heading" className={styles.heading}>
            Your <span className={styles.gold}>Donation</span> is handled with care, transparency
            and accountability.
          </h2>
          <p className={styles.sub}>
            Everything is structured and verified — from account handling to item processing — so
            you can give or bid with confidence.
          </p>
        </div>

        <div className={styles.grid}>
          {/* 1. Donation Account */}
          <div className={styles.card}>
            <h3 className={styles.title}>Secure Donation Account</h3>
            <p className={styles.text}>
              All <span className={styles.gold}>Donations</span> are received through a verified,
              single-purpose account. No staff member receives Donations personally.
            </p>
          </div>

          {/* 2. Oversight committee */}
          <div className={styles.card}>
            <h3 className={styles.title}>Oversight & Sign-off</h3>
            <p className={styles.text}>
              A small internal committee signs off every expense. This keeps spending fully
              documented and prevents misuse.
            </p>
          </div>

          {/* 3. No cash-in-person */}
          <div className={styles.card}>
            <h3 className={styles.title}>No Cash-in-Person</h3>
            <p className={styles.text}>
              For your safety, we never ask for cash-in-hand for Donations or auction wins. Payments
              are made <strong>only</strong> through our official channels.
            </p>
          </div>

          {/* 4. Checked & graded items */}
          <div className={styles.card}>
            <h3 className={styles.title}>Checked & Graded Items</h3>
            <p className={styles.text}>
              All electronics are inspected, safely wiped, graded and packaged before listing. We
              clearly label each item’s condition.
            </p>
          </div>

          {/* 5. Shipping & tracking */}
          <div className={styles.card}>
            <h3 className={styles.title}>Secure Shipping</h3>
            <p className={styles.text}>
              Winning bidders receive their items through trusted couriers, including tracking
              whenever possible.
            </p>
          </div>

          {/* 6. Receipts & reporting */}
          <div className={styles.card}>
            <h3 className={styles.title}>Receipts for Every Donation</h3>
            <p className={styles.text}>
              You always receive a simple, clear receipt — and annual summaries will be published
              from 2025 onwards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

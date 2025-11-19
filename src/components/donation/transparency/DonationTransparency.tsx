'use client';

import styles from './DonationTransparency.module.scss';

export const donationTransparencyMetadata = {
  title: 'Donation Transparency & Financial Handling – Travel with Shego',
  description:
    'A clear, written breakdown of how Donations are handled: where funds are held, who approves spending, how items are processed and what our refund position is.',
};

export default function DonationTransparency() {
  return (
    <section className={styles.wrap} aria-labelledby="donation-transparency-heading">
      <div className={styles.inner}>
        {/* Lead */}
        <header className={styles.lead}>
          <span className={styles.kicker}>Transparency in plain language</span>

          <h2 id="donation-transparency-heading" className={styles.heading}>
            How your <span className={styles.gold}>Donation</span> moves from you to Baraawe.
          </h2>

          <p className={styles.sub}>
            No fine print or jargon – just a clear explanation of where money goes, who signs it
            off, and how items are handled along the way.
          </p>
        </header>

        {/* Money trail / flow line */}
        <section className={styles.flow} aria-label="Money trail from donor to community">
          <div className={styles.flowItem}>
            <div className={styles.dot} />
            <div className={styles.flowText}>
              <h3 className={styles.flowTitle}>1. Your Donation</h3>
              <p className={styles.flowBody}>
                You give directly or win an auction. Payments are made through our official Donation
                partner – never through social media or personal accounts.
              </p>
            </div>
          </div>

          <div className={styles.flowItem}>
            <div className={styles.dot} />
            <div className={styles.flowText}>
              <h3 className={styles.flowTitle}>2. Secure account & oversight</h3>
              <p className={styles.flowBody}>
                Funds are held in a single-purpose Donation account in the UK. A small oversight
                group reviews and signs off every spend.
              </p>
            </div>
          </div>

          <div className={styles.flowItem}>
            <div className={styles.dot} />
            <div className={styles.flowText}>
              <h3 className={styles.flowTitle}>3. Community support in Baraawe</h3>
              <p className={styles.flowBody}>
                Money is used for shelter support, food, school supplies, transport and hygiene
                kits. Each payment is logged for traceability.
              </p>
            </div>
          </div>
        </section>

        {/* Two-band written breakdown */}
        <section className={styles.bands}>
          <article className={styles.band}>
            <h3 className={styles.bandTitle}>Money in &amp; oversight</h3>
            <dl className={styles.list}>
              <div className={styles.row}>
                <dt>Where your Donation is held</dt>
                <dd>
                  All <span className={styles.gold}>Donations</span> are held in a single-purpose,
                  verified account in the United Kingdom. Access is restricted to authorised
                  individuals only.
                </dd>
              </div>

              <div className={styles.row}>
                <dt>Who approves spending</dt>
                <dd>
                  A small oversight committee reviews and approves every expenditure. Each payment
                  is logged with a clear purpose and amount.
                </dd>
              </div>

              <div className={styles.row}>
                <dt>How Donations are used</dt>
                <dd>
                  Funds are directed to shelter support, food, education materials, transport,
                  hygiene kits and urgent community needs in Baraawe – not unnecessary admin.
                </dd>
              </div>

              <div className={styles.row}>
                <dt>Reporting &amp; summaries</dt>
                <dd>
                  Simple annual summaries of total <span className={styles.gold}>Donations</span>{' '}
                  and key spending categories will be published from 2025 onwards.
                </dd>
              </div>
            </dl>
          </article>

          <article className={styles.band}>
            <h3 className={styles.bandTitle}>Items, shipping &amp; refunds</h3>
            <dl className={styles.list}>
              <div className={styles.row}>
                <dt>Electronics grading</dt>
                <dd>
                  Each device is inspected, safely data-wiped and graded (A, B or C) before being
                  listed. Only devices that pass testing appear in the auction.
                </dd>
              </div>

              <div className={styles.row}>
                <dt>Shipping &amp; tracking</dt>
                <dd>
                  Winning bidders receive items via trusted couriers with tracking wherever
                  possible. Packaging is chosen to protect devices in transit.
                </dd>
              </div>

              <div className={styles.row}>
                <dt>Refund position</dt>
                <dd>
                  As auction wins are tied directly to{' '}
                  <span className={styles.gold}>Donations</span>, we cannot promise refunds on
                  change-of-mind. Clear defects are handled on a case-by-case basis.
                </dd>
              </div>

              <div className={styles.row}>
                <dt>Security guarantee</dt>
                <dd>
                  We never share payment links or bank details via DMs. If anything looks
                  suspicious, you can always verify with us using the contact details at the bottom
                  of this page.
                </dd>
              </div>
            </dl>
          </article>
        </section>
      </div>
    </section>
  );
}

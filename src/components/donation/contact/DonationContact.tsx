'use client';

import Link from 'next/link';
import styles from './DonationContact.module.scss';

export const donationContactMetadata = {
  title: 'Contact – Travel with Shego',
  description:
    'Contact us about Donations, monthly giving or auction items through email or WhatsApp.',
};

type Props = {
  email?: string;
  whatsappHref?: string;
};

export default function DonationContact({
  email = 'support@travelwithshego.com',
  whatsappHref = 'https://wa.me/000000000000', // replace with real number
}: Props) {
  return (
    <section className={styles.wrap} aria-labelledby="donation-contact-heading">
      <div className={styles.inner}>
        <header className={styles.lead}>
          <span className={styles.kicker}>Contact</span>

          <h2 id="donation-contact-heading" className={styles.heading}>
            Reach us directly about your <span className={styles.gold}>Donation</span> or an auction
            item.
          </h2>

          <p className={styles.sub}>
            Quick, simple, and human — choose the way that’s easiest for you.
          </p>
        </header>

        {/* Icon row */}
        <div className={styles.icons}>
          {/* Email */}
          <a
            href={`mailto:${email}`}
            className={`${styles.iconLink} ${styles.email}`}
            aria-label="Email support"
          >
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
              <polyline points="3,7 12,13 21,7" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappHref}
            className={`${styles.iconLink} ${styles.whatsapp}`}
            aria-label="WhatsApp support"
          >
            <svg className={styles.icon} viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16.1 3C9.3 3 3.8 8.5 3.8 15.3c0 2.7.8 5.2 2.3 7.3L4 29l6.7-2c2 1.1 4.2 1.7 6.4 1.7 6.8 0 12.3-5.5 12.3-12.2C29.5 8.5 23 3 16.1 3zm0 22.3c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4 1.2 1.2-3.9-.3-.4a9.3 9.3 0 0 1-1.6-5.1c0-5.1 4.2-9.2 9.4-9.2 2.5 0 4.8 1 6.6 2.7 1.7 1.7 2.7 4 2.7 6.5-.1 5.1-4.3 9.3-9.4 9.3z" />
              <path d="M21.9 19.1c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.8.1-.2.3-.9 1-1.1 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.6-.9-.8-1.5-1.9-1.7-2.2-.2-.3 0-.5.1-.7.2-.2.3-.4.5-.6l.3-.4c.1-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.6.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.2.3 2 3.4 4.7 4.8.6.3 1.2.6 1.8.8.8.3 1.5.3 2.1.2.7-.1 1.8-.7 2-1.3.2-.6.2-1.1.1-1.2-.1 0-.3-.1-.6-.2z" />
            </svg>
          </a>
        </div>

        {/* Contact page button */}
        <div className={styles.buttonRow}>
          <Link href="/contact" className={styles.contactBtn}>
            Open full contact page
          </Link>
        </div>

        <p className={styles.note}>
          We never send payment requests from personal accounts. If something feels unusual, contact
          us first and check that the <span className={styles.gold}>Donation</span> details match
          this site.
        </p>
      </div>
    </section>
  );
}

'use client';

import styles from './Donation.module.scss';

// Components
import Hero from '@/components/donation/hero/Hero';
import DirectDonation from '@/components/donation/direct/DirectDonation';
import QuickStats from '@/components/donation/quickstats/QuickStats';
import AuctionHighlights from '@/components/donation/auctionHighlights/AuctionHighlights';
import AuctionListing from '@/components/donation/listing/AuctionListing';
import DonationHowItWorks from '@/components/donation/howitworks/DonationHowItWorks';
import DonationTrust from '@/components/donation/trust/DonationTrust';
import DonationStories from '@/components/donation/stories/DonationStories';
import DonationTransparency from '@/components/donation/transparency/DonationTransparency';
import DonationFAQs from '@/components/donation/faqs/DonationFAQs';
import DonationContact from '@/components/donation/contact/DonationContact';

export default function DonationClient() {
  return (
    <main className={styles.page}>
      {/* Section 1 — Hero */}
      <Hero />

      {/* Section 2 — Quick Stats */}
      <QuickStats />

      {/* Section 3 — Direct Donation */}
      <DirectDonation />

      {/* Section 4 — Highlights (quick bids) */}
      <AuctionHighlights />

      {/* Section 5 — Full Auction Grid */}
      <AuctionListing />

      {/* Section 6 — How It Works */}
      <DonationHowItWorks />

      {/* Section 7 — Trust / Transparency */}
      <DonationTrust />

      {/* Section 8 — Stories */}
      <DonationStories />

      {/* Section 9 — Transparency Details */}
      <DonationTransparency />

      {/* Section 10 — FAQs */}
      <DonationFAQs />

      {/* Section 11 — Contact */}
      <DonationContact />
    </main>
  );
}

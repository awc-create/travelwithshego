'use client';

import styles from './Donation.module.scss';

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
import RamadanBannerDonation from '@/components/donation/RamadanBannerDonation';

import { useDonationStats } from '@/hooks/useDonationStats';

export default function DonationClient() {
  // 🔥 Live fundraising stats
  const { stats, loading } = useDonationStats();

  const raisedPence = stats?.raisedPence ?? 0;
  const goalPence = stats?.goalPence ?? 10_000 * 100;

  // 🔥 PayPal URLs from env
  const paypalUrl = process.env.NEXT_PUBLIC_PAYPAL_DONATION_URL ?? null;
  const ramadanPaypalUrl = process.env.NEXT_PUBLIC_RAMADAN_DONATION_URL ?? null;

  return (
    <main className={styles.page}>
      {/* Hero with live numbers */}
      <Hero raisedPence={raisedPence} goalPence={goalPence} />

      {/* Ramadan campaign block */}
      <RamadanBannerDonation paypalUrl={ramadanPaypalUrl} />

      {/* Quick Stats with live numbers */}
      <QuickStats stats={stats} loading={loading} />

      {/* Direct Donation with PAYPAL + optional stats */}
      <DirectDonation paypalUrl={paypalUrl} />

      <AuctionHighlights />
      <AuctionListing />
      <DonationHowItWorks />
      <DonationTrust />
      <DonationStories />
      <DonationTransparency />
      <DonationFAQs />
      <DonationContact />
    </main>
  );
}

// src/app/donation/DonationClient.tsx
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

type DonationClientProps = {
  paypalUrl: string | null;
  ramadanPaypalUrl: string | null;
};

export default function DonationClient({ paypalUrl, ramadanPaypalUrl }: DonationClientProps) {
  // 🔥 Live stats
  const { stats, loading } = useDonationStats();
  const raisedPence = stats?.raisedPence ?? 0;
  const goalPence = stats?.goalPence ?? 10_000 * 100;

  return (
    <main className={styles.page}>
      {/* Hero */}
      <Hero raisedPence={raisedPence} goalPence={goalPence} />

      {/* ⭐ Ramadan special block */}
      <RamadanBannerDonation paypalUrl={ramadanPaypalUrl} />

      {/* Quick stats */}
      <QuickStats stats={stats} loading={loading} />

      {/* Direct donation — Stripe + PayPal */}
      <DirectDonation paypalUrl={paypalUrl} />

      {/* Auction sections */}
      <AuctionHighlights />
      <AuctionListing />

      {/* Info sections */}
      <DonationHowItWorks />
      <DonationTrust />
      <DonationStories />
      <DonationTransparency />
      <DonationFAQs />
      <DonationContact />
    </main>
  );
}

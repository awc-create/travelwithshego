// src/app/donation/page.tsx
import type { Metadata } from 'next';
import DonationClient from './DonationClient';

export const metadata: Metadata = {
  title: 'Donate to Baraawe | Travel with Shego',
  description:
    'Give safe shelter, education and care to children and families in Baraawe. Make a direct donation or bid on carefully-checked items to support the work on the ground.',
  openGraph: {
    title: 'Donate to Baraawe | Travel with Shego',
    description:
      'Your Donation gives shelter, safety and education to children and families in Baraawe.',
    type: 'website',
    url: '/donation',
  },
  alternates: { canonical: '/donation' },
};

export const dynamic = 'force-dynamic'; // ensures server runtime env is used

export default function DonationPage() {
  // ⭐ Read env on SERVER — always works on Hetzner/Vercel
  const paypalUrl = 'https://www.paypal.com/ncp/payment/EN8NFTKFUCLR8';
  const appealPaypalUrl = 'https://www.paypal.com/ncp/payment/7RSWYTZQDP7NL';

  return <DonationClient paypalUrl={paypalUrl} appealPaypalUrl={appealPaypalUrl} />;
}

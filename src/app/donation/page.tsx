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

export default function DonationPage() {
  return <DonationClient />;
}

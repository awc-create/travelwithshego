// src/app/HomeClient.tsx
'use client';

import Hero from '@/components/home/hero/Hero';
import Mission from '@/components/home/mission/Mission';
import Testimonial from '@/components/home/testimonial/Testimonial';
import Donation from '@/components/home/donation/Donation';
import SectionDivider from '@/components/common/SectionDivider';
import BuildingGallery from '@/components/home/gallery/BuildingGallery';
import type { HomeData } from '@/lib/getHomeData';
import { useDonationStats } from '@/hooks/useDonationStats';
import RamadanHomeBanner from '@/components/home/RamadanBannerHome';

type HomeClientProps = {
  data: HomeData;
  buildingImages?: string[];
};

export default function HomeClient({ data, buildingImages = [] }: HomeClientProps) {
  const { stats } = useDonationStats();

  const raised = (stats?.raisedPence ?? 3_400 * 100) / 100;
  const goal = (stats?.goalPence ?? 10_000 * 100) / 100;

  // 🔥 Use the correct env var name
  const ramadanPaypalUrl = process.env.NEXT_PUBLIC_RAMADAN_DONATION_URL ?? null;

  return (
    <>
      {/* ⭐ Ramadan banner strip */}
      <RamadanHomeBanner paypalUrl={ramadanPaypalUrl} />

      <Hero raised={raised} goal={goal} donateHref="/donation" />

      <SectionDivider variant="wave" color="#faf8f1" height={88} />

      <Mission id="mission" donateHref="/donation" stats={data.mission} />

      <SectionDivider variant="angle" color="#ffffff" height={36} />

      <BuildingGallery images={buildingImages} />

      <SectionDivider variant="curve" color="#ffffff" height={72} />

      <Testimonial
        quote="When we educate one child, we educate the whole village."
        author="Project Lead, Baraawe"
        role="Founder"
      />

      <SectionDivider variant="soft" color="#ffffff" height={72} />

      <Donation
        donateHref="/donation"
        raised={raised}
        goal={goal}
        contactHref="/contact"
        contactLabel="Questions? Contact us"
      />
    </>
  );
}

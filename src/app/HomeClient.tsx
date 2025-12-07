// src/app/HomeClient.tsx
'use client';

import Hero from '@/components/home/hero/Hero';
import Mission from '@/components/home/mission/Mission';
import Gallery from '@/components/home/gallery/Gallery';
import Testimonial from '@/components/home/testimonial/Testimonial';
import Donation from '@/components/home/donation/Donation';
import SectionDivider from '@/components/common/SectionDivider';
import type { HomeData } from '@/lib/getHomeData';
import { useDonationStats } from '@/hooks/useDonationStats';

type HomeClientProps = {
  data: HomeData;
};

export default function HomeClient({ data }: HomeClientProps) {
  const { stats } = useDonationStats();

  const raised = (stats?.raisedPence ?? 3_400 * 100) / 100;
  const goal = (stats?.goalPence ?? 10_000 * 100) / 100;

  return (
    <>
      <Hero raised={raised} goal={goal} donateHref="/donation" />

      <SectionDivider variant="wave" color="#faf8f1" height={88} />

      <Mission id="mission" donateHref="/donation" stats={data.mission} />

      <SectionDivider variant="angle" color="#ffffff" height={36} />

      <Gallery
        id="gallery"
        caption={data.gallery.caption}
        images={data.gallery.images}
        showCarousel
      />

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

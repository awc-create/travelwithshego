// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import Hero from '@/components/home/hero/Hero';
import Mission from '@/components/home/mission/Mission';
import Gallery from '@/components/home/gallery/Gallery';
import Testimonial from '@/components/home/testimonial/Testimonial';
import Donation from '@/components/home/donation/Donation';
import SectionDivider from '@/components/common/SectionDivider';

export default async function HomePage() {
  const [mission, gallery] = await Promise.all([
    prisma.homeMission.findUnique({ where: { key: 'mission' } }),
    prisma.homeGallery.findUnique({ where: { key: 'gallery' } }),
  ]);

  return (
    <main className="homeContainer no-nav-offset snap">
      <Hero />

      {/* Hero -> Mission */}
      <SectionDivider variant="wave" color="#faf8f1" height={88} />

      <Mission
        id="mission"
        donateHref="/donate"
        stats={{
          familiesHoused: mission?.familiesHoused ?? 0,
          childrenInCare: mission?.childrenInCare ?? 0,
          mealsServed: mission?.mealsServed ?? 0,
        }}
      />

      {/* Mission (white end) -> Gallery (white) — subtle angle so sections feel distinct */}
      <SectionDivider variant="angle" color="#ffffff" height={36} />

      <Gallery
        id="gallery"
        caption={gallery?.caption ?? 'Our journey in pictures'}
        images={gallery?.imageUrls ?? []}
        showCarousel
      />

      {/* Gallery (white) -> Testimonial (starts white gradient) */}
      <SectionDivider variant="curve" color="#ffffff" height={72} />

      <Testimonial
        quote="When we educate one child, we educate the whole village."
        author="Project Lead, Baraawe"
        role="Founder"
      />

      {/* Testimonial -> Donation (white) */}
      <SectionDivider variant="soft" color="#ffffff" height={72} />

      <Donation
        donateHref="/donate"
        raised={3400}
        goal={10000}
        contactHref="/contact"
        contactLabel="Questions? Contact us"
      />
    </main>
  );
}

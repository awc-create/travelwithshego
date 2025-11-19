'use client';

import styles from './Founder.module.scss';
import FounderHero from '@/components/founder/hero/FounderHero';
import FounderStory from '@/components/founder/story/FounderStory';
import ShegoBand from '@/components/founder/band/ShegoBand';
import FounderImpact from '@/components/founder/impact/FounderImpact';
import FounderSupport from '@/components/founder/support/FounderSupport';
import FounderLegacy from '@/components/founder/legacy/FounderLegacy';

// import FounderBio from "@/components/founder/bio/FounderBio";
// import FounderBand from "@/components/founder/band/FounderBand";
// import FounderCommunity from "@/components/founder/community/FounderCommunity";
// import FounderGallery from "@/components/founder/gallery/FounderGallery";
// import FounderQuote from "@/components/founder/quote/FounderQuote";
// import FounderCTA from "@/components/founder/cta/FounderCTA";

export default function FounderClient() {
  return (
    <main className={styles.page}>
      <FounderHero />
      <FounderStory />
      <ShegoBand />
      <FounderLegacy />
      <FounderImpact />
      <FounderSupport />
      {/* <FounderBio />
      <FounderBand />
      <FounderCommunity />
      <FounderGallery />
      <FounderQuote />
      <FounderCTA /> */}
    </main>
  );
}

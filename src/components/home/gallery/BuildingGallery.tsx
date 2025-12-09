// src/components/home/gallery/BuildingGallery.tsx
'use client';

import Gallery from './Gallery';

type BuildingGalleryProps = {
  images?: string[]; // optional, defaulted below
};

export default function BuildingGallery({ images = [] }: BuildingGalleryProps) {
  return (
    <Gallery
      id="building-gallery"
      caption="Early building work and community moments from Baraawe."
      images={images}
      showCarousel
      carouselTitle="Building the future in Baraawe"
      carouselSubtitle="From foundations to finished classrooms"
    />
  );
}

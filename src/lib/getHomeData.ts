// src/lib/getHomeData.ts
import { prisma } from '@/lib/prisma';

export type HomeMissionStats = {
  familiesHoused: number;
  childrenInCare: number;
  mealsServed: number;
};

export type HomeGalleryData = {
  caption: string;
  images: string[];
};

export type HomeData = {
  mission: HomeMissionStats;
  gallery: HomeGalleryData;
  ok: boolean;
};

export async function getHomeData(): Promise<HomeData> {
  try {
    const [mission, gallery] = await Promise.all([
      prisma.homeMission.findUnique({ where: { key: 'mission' } }),
      prisma.homeGallery.findUnique({ where: { key: 'gallery' } }),
    ]);

    return {
      mission: {
        familiesHoused: mission?.familiesHoused ?? 0,
        childrenInCare: mission?.childrenInCare ?? 0,
        mealsServed: mission?.mealsServed ?? 0,
      },
      gallery: {
        caption: gallery?.caption ?? 'Our journey in pictures',
        images: gallery?.imageUrls ?? [],
      },
      ok: true,
    };
  } catch (error) {
    console.error('[Home] Failed to load home data, falling back:', error);

    return {
      mission: {
        familiesHoused: 0,
        childrenInCare: 0,
        mealsServed: 0,
      },
      gallery: {
        caption: 'Our journey in pictures',
        images: [],
      },
      ok: false,
    };
  }
}

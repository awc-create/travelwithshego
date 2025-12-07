// prisma/seed.ts
import 'dotenv/config';
// IMPORTANT: use the same Prisma client setup as the app
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 Seeding auction items...');

  // Dev-only: clear existing items so reseeding is safe
  await prisma.auctionItem.deleteMany();

  await prisma.auctionItem.createMany({
    data: [
      {
        slug: 'baraawe-art-print',
        title: 'Limited Baraawe Art Print',
        description:
          'A high-quality print inspired by Baraawe, helping fund school supplies and teaching materials.',
        imageUrl: null, // or a real URL from your Media table
        pricePence: 5000, // £50
        active: true,
        sortOrder: 1,
      },
      {
        slug: 'handcrafted-basket',
        title: 'Traditional Handcrafted Basket',
        description: 'A beautiful handcrafted basket made in support of the Baraawe initiative.',
        imageUrl: null,
        pricePence: 3500, // £35
        active: true,
        sortOrder: 2,
      },
    ],
  });

  console.log('✅ Auction items seeded.');
}

main()
  .catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

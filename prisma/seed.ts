// prisma/seed.ts
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

async function seedAdmin() {
  console.log('🌱 Seeding admin user...');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminName = process.env.ADMIN_NAME ?? 'Head Admin';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD missing in .env. Skipping admin seeding.');
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(
      `ℹ️ Admin already exists: ${existing.email} (id: ${existing.id}, role: ${existing.role})`
    );
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      role: 'admin',
      passwordHash,
    },
  });

  console.log(`✅ Admin user created: ${user.email} (id: ${user.id})`);
}

async function seedAuctionItems() {
  console.log('🌱 Seeding auction items (idempotent)...');

  const items = [
    {
      slug: 'baraawe-art-print',
      title: 'Limited Baraawe Art Print',
      description:
        'A high-quality print inspired by Baraawe, helping fund school supplies and teaching materials.',
      imageUrl: null as string | null,
      pricePence: 50_00, // $50.00 equivalent (if you later switch currency)
      active: true,
      sortOrder: 1,
    },
    {
      slug: 'handcrafted-basket',
      title: 'Traditional Handcrafted Basket',
      description: 'A beautiful handcrafted basket made in support of the Baraawe initiative.',
      imageUrl: null as string | null,
      pricePence: 35_00, // $35.00 equivalent
      active: true,
      sortOrder: 2,
    },
  ];

  for (const item of items) {
    // If an item with this slug already exists, skip
    const existing = await prisma.auctionItem.findFirst({
      where: { slug: item.slug },
    });

    if (existing) {
      console.log(`ℹ️ Auction item exists, skipping: ${item.slug}`);
      continue;
    }

    const created = await prisma.auctionItem.create({ data: item });
    console.log(`✅ Auction item created: ${created.slug} (${created.title})`);
  }

  console.log('✅ Auction seeding complete.');
}

async function main() {
  console.log('🌱 Seeding database...');

  await seedAdmin();
  await seedAuctionItems();

  console.log('✅ All seeding steps finished.');
}

main()
  .catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

-- AlterTable
ALTER TABLE "HomeGallery" ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "HomeTestimonial" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'testimonial',
    "quote" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "role" TEXT,
    "avatarSrc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeDonation" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'donation',
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeDonation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomeTestimonial_key_key" ON "HomeTestimonial"("key");

-- CreateIndex
CREATE UNIQUE INDEX "HomeDonation_key_key" ON "HomeDonation"("key");

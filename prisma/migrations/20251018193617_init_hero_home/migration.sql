-- CreateTable
CREATE TABLE "HomeMission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'mission',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "familiesHoused" INTEGER NOT NULL DEFAULT 0,
    "childrenInCare" INTEGER NOT NULL DEFAULT 0,
    "mealsServed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeGallery" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'gallery',
    "imageUrls" TEXT[],
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeGallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomeMission_key_key" ON "HomeMission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "HomeGallery_key_key" ON "HomeGallery"("key");

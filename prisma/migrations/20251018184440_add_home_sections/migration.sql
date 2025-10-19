-- CreateTable
CREATE TABLE "HeroHome" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'home',
    "imageSrc" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroHome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'about',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bullets" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPage" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'contact',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "submitLabel" TEXT NOT NULL,
    "successMessage" TEXT NOT NULL,
    "recipientEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroHome_key_key" ON "HeroHome"("key");

-- CreateIndex
CREATE UNIQUE INDEX "AboutUs_key_key" ON "AboutUs"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ContactPage_key_key" ON "ContactPage"("key");

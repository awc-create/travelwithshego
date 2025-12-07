-- AlterTable
ALTER TABLE "AuctionBid" ADD COLUMN     "isWinner" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "AuctionItem" ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false;

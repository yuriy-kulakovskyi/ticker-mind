/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `ticker` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "isDeleted",
DROP COLUMN "ticker",
ADD COLUMN     "tickers" TEXT[],
ADD COLUMN     "watchlistId" TEXT;

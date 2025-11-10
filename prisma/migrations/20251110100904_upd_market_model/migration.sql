/*
  Warnings:

  - You are about to drop the column `email` on the `Market` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Market` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Market` table. All the data in the column will be lost.
  - You are about to drop the `MarketWeeklyData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `info` to the `Market` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastRefreshed` to the `Market` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeZone` to the `Market` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."MarketWeeklyData" DROP CONSTRAINT "MarketWeeklyData_marketId_fkey";

-- DropIndex
DROP INDEX "public"."Market_symbol_key";

-- AlterTable
ALTER TABLE "Market" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "timezone",
ADD COLUMN     "info" TEXT NOT NULL,
ADD COLUMN     "lastRefreshed" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeZone" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."MarketWeeklyData";

-- CreateTable
CREATE TABLE "Candle" (
    "id" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "volume" INTEGER NOT NULL,

    CONSTRAINT "Candle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Candle" ADD CONSTRAINT "Candle_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

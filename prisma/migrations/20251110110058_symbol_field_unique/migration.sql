/*
  Warnings:

  - A unique constraint covering the columns `[symbol]` on the table `Market` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Market_symbol_key" ON "Market"("symbol");

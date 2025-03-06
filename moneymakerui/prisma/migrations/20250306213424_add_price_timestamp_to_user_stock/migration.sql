/*
  Warnings:

  - A unique constraint covering the columns `[email,symbol]` on the table `UserStock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `priceTimestamp` to the `UserStock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserStock" DROP CONSTRAINT "UserStock_symbol_fkey";

-- DropIndex
DROP INDEX "stock_prices_symbol_key";

-- AlterTable
ALTER TABLE "UserStock" ADD COLUMN     "priceTimestamp" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserStock_email_symbol_key" ON "UserStock"("email", "symbol");

-- AddForeignKey
ALTER TABLE "UserStock" ADD CONSTRAINT "UserStock_symbol_priceTimestamp_fkey" FOREIGN KEY ("symbol", "priceTimestamp") REFERENCES "stock_prices"("symbol", "timestamp") ON DELETE RESTRICT ON UPDATE CASCADE;

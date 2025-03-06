/*
  Warnings:

  - A unique constraint covering the columns `[symbol]` on the table `stock_prices` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserStock_email_symbol_key";

-- CreateIndex
CREATE UNIQUE INDEX "stock_prices_symbol_key" ON "stock_prices"("symbol");

-- AddForeignKey
ALTER TABLE "UserStock" ADD CONSTRAINT "UserStock_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "stock_prices"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

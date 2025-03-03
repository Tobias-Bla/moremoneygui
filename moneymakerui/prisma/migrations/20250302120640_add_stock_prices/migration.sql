/*
  Warnings:

  - The primary key for the `stock_prices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `stock_prices` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `stock_prices` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- DropIndex
DROP INDEX "stock_prices_symbol_key";

-- AlterTable
ALTER TABLE "stock_prices" DROP CONSTRAINT "stock_prices_pkey",
DROP COLUMN "id",
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "timestamp" DROP DEFAULT,
ADD CONSTRAINT "stock_prices_pkey" PRIMARY KEY ("symbol", "timestamp");

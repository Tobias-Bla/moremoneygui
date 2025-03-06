/*
  Warnings:

  - The primary key for the `UserStock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `UserStock` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `UserStock` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `UserStock` table. All the data in the column will be lost.
  - You are about to alter the column `symbol` on the `UserStock` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - The primary key for the `stock_prices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `symbol` on the `stock_prices` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `price` on the `stock_prices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `userEmail` to the `UserStock` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserStock_email_symbol_key";

-- AlterTable
ALTER TABLE "UserStock" DROP CONSTRAINT "UserStock_pkey",
DROP COLUMN "email",
DROP COLUMN "price",
DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "userEmail" VARCHAR(255) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "symbol" SET DATA TYPE VARCHAR(10),
ADD CONSTRAINT "UserStock_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UserStock_id_seq";

-- AlterTable
ALTER TABLE "stock_prices" DROP CONSTRAINT "stock_prices_pkey",
ALTER COLUMN "symbol" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMPTZ(6),
ADD CONSTRAINT "stock_prices_pkey" PRIMARY KEY ("symbol", "timestamp");

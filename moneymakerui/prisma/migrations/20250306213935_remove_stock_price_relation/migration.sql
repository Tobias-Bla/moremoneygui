/*
  Warnings:

  - You are about to drop the column `priceTimestamp` on the `UserStock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserStock" DROP CONSTRAINT "UserStock_symbol_priceTimestamp_fkey";

-- AlterTable
ALTER TABLE "UserStock" DROP COLUMN "priceTimestamp";

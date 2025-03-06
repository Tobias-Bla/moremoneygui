/*
  Warnings:

  - A unique constraint covering the columns `[email,symbol]` on the table `UserStock` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserStock" ALTER COLUMN "symbol" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserStock_email_symbol_key" ON "UserStock"("email", "symbol");

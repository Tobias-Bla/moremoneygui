/*
  Warnings:

  - You are about to drop the column `userEmail` on the `UserStock` table. All the data in the column will be lost.
  - Added the required column `email` to the `UserStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserStock" DROP COLUMN "userEmail",
ADD COLUMN     "email" VARCHAR(255) NOT NULL;

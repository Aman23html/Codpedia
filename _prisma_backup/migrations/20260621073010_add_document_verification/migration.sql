/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `VerificationDocument` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "VerificationDocument" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationDocument_userId_key" ON "VerificationDocument"("userId");

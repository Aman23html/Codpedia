/*
  Warnings:

  - A unique constraint covering the columns `[inchargeId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "inchargeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Department_inchargeId_key" ON "Department"("inchargeId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_inchargeId_fkey" FOREIGN KEY ("inchargeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

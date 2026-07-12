/*
  Warnings:

  - A unique constraint covering the columns `[employeeCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "OperationReportStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'WAITING_FOR_SYNC', 'VERIFIED', 'MISMATCH', 'CORRECTION_REQUIRED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "employeeCode" TEXT,
ADD COLUMN     "profileImageUrl" TEXT;

-- CreateTable
CREATE TABLE "EmployeeOperationReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "queryGenerated" INTEGER NOT NULL DEFAULT 0,
    "dealsDone" INTEGER NOT NULL DEFAULT 0,
    "tutorAssigned" INTEGER NOT NULL DEFAULT 0,
    "dealsDoneAmount" INTEGER NOT NULL DEFAULT 0,
    "workNotes" TEXT,
    "status" "OperationReportStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewRemarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeOperationReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployeeOperationReport_reportDate_idx" ON "EmployeeOperationReport"("reportDate");

-- CreateIndex
CREATE INDEX "EmployeeOperationReport_status_idx" ON "EmployeeOperationReport"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeOperationReport_userId_reportDate_key" ON "EmployeeOperationReport"("userId", "reportDate");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeCode_key" ON "User"("employeeCode");

-- AddForeignKey
ALTER TABLE "EmployeeOperationReport" ADD CONSTRAINT "EmployeeOperationReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

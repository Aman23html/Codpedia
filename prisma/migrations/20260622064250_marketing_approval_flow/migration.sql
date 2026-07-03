-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "MarketingReport" ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "MarketingReport" ADD CONSTRAINT "MarketingReport_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

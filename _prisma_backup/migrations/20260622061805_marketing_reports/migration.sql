-- CreateEnum
CREATE TYPE "Country" AS ENUM ('NORTH_AMERICA', 'EUROPE', 'AUSTRALIA');

-- CreateTable
CREATE TABLE "MarketingReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "country" "Country" NOT NULL,
    "whatsappGroupsJoined" INTEGER NOT NULL DEFAULT 0,
    "whatsappPostsDone" INTEGER NOT NULL DEFAULT 0,
    "telegramGroupsJoined" INTEGER NOT NULL DEFAULT 0,
    "telegramPostsDone" INTEGER NOT NULL DEFAULT 0,
    "facebookGroupsJoined" INTEGER NOT NULL DEFAULT 0,
    "facebookPostsDone" INTEGER NOT NULL DEFAULT 0,
    "resourceLogin" INTEGER NOT NULL DEFAULT 0,
    "accountClean" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingReport_userId_country_reportDate_key" ON "MarketingReport"("userId", "country", "reportDate");

-- AddForeignKey
ALTER TABLE "MarketingReport" ADD CONSTRAINT "MarketingReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
ALTER TABLE "Job" RENAME to "JobParams";

-- CreateTable
-- CREATE TABLE "JobParams" (
--     "id" SERIAL NOT NULL,
--     "name" TEXT NOT NULL,
--     "jobRunner" TEXT NOT NULL,
--     "jobDataId" INTEGER NOT NULL,
--     "cron" TEXT,
--     "timeout" INTEGER DEFAULT 0,
--     "interval" INTEGER,
--     "active" BOOLEAN NOT NULL DEFAULT true,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "lastRanAt" TIMESTAMP(3),
--     "lastFailedAt" TIMESTAMP(3),
--     "lastFailErrorMessage" TEXT,
--
--     CONSTRAINT "JobParams_pkey" PRIMARY KEY ("id")
-- );

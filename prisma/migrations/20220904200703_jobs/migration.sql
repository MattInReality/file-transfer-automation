/*
  Warnings:

  - Added the required column `name` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "lastFailErrorMessage" TEXT,
ADD COLUMN     "lastFailedAt" TIMESTAMP(3),
ADD COLUMN     "lastRanAt" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL;

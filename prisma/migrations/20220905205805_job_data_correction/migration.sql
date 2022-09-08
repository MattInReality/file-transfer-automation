/*
  Warnings:

  - Changed the type of `jobDataId` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "jobDataId",
ADD COLUMN     "jobDataId" INTEGER NOT NULL,
ALTER COLUMN "cron" DROP NOT NULL,
ALTER COLUMN "timeout" SET DEFAULT 0;

/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `JobParams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Transfer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobParams_name_key" ON "JobParams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_name_key" ON "Transfer"("name");

-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "apiKey" TEXT,
    "secure" BOOLEAN,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferEndPoint" (
    "id" SERIAL NOT NULL,
    "connectionType" TEXT NOT NULL,
    "connectionOptionsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransferEndPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sourceOptionsId" INTEGER NOT NULL,
    "remoteOptionsId" INTEGER NOT NULL,
    "sourcePath" TEXT NOT NULL,
    "remotePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "jobRunner" TEXT NOT NULL,
    "jobDataId" TEXT NOT NULL,
    "cron" TEXT NOT NULL,
    "timeout" INTEGER,
    "interval" INTEGER,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_name_key" ON "Connection"("name");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferEndPoint" ADD CONSTRAINT "TransferEndPoint_connectionOptionsId_fkey" FOREIGN KEY ("connectionOptionsId") REFERENCES "Connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_sourceOptionsId_fkey" FOREIGN KEY ("sourceOptionsId") REFERENCES "TransferEndPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_remoteOptionsId_fkey" FOREIGN KEY ("remoteOptionsId") REFERENCES "TransferEndPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

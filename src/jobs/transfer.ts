import { workerData } from "worker_threads";
import { PrismaClient } from "@prisma/client";
import { TransferBroker } from "../services/Transfer/TransferBroker";
import { jobWorkerMessageReceiver } from "../utils/helpers";

(async () => {
  const prisma = new PrismaClient();

  try {
    const { jobId, jobDataId } = workerData.job.worker.workerData;
    // I want the job done as quickly as possible so I'm not going to wait for lazy connection.
    await prisma.$connect();

    const transferData = await prisma.transfer.findUnique({
      where: {
        id: jobDataId,
      },
      include: {
        sourceOptions: true,
        remoteOptions: true,
      },
    });

    if (!transferData) {
      return jobWorkerMessageReceiver("Transfer Data not found");
    }

    const transferBroker = new TransferBroker(transferData);
    await prisma.$disconnect();
    await transferBroker.makeTransfer();
    await prisma.jobParams.update({
      where: { id: jobId },
      data: { lastRanAt: new Date() },
    });
    jobWorkerMessageReceiver(
      `Transfer ${jobId} Complete at ${new Date().toLocaleTimeString()}`
    );
  } catch (e: any) {
    await prisma.$disconnect();
    jobWorkerMessageReceiver(e.message, true);
  }
})();

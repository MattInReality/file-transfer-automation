import { parentPort, workerData } from "worker_threads";
import { TransferBroker } from "../Transfer/TransferBroker.js";
import { PrismaClient } from "@prisma/client";

(async () => {
  let prisma;
  try {
    let message: string;
    prisma = new PrismaClient();
    await prisma.$connect();

    const transferData = await prisma.transfer.findUnique({
      where: {
        id: workerData.job.worker.workerData,
      },
      include: {
        sourceOptions: true,
        remoteOptions: true,
      },
    });
    if (!transferData) {
      message = "Transfer Data not found";
    } else {
      const transferBroker = new TransferBroker(transferData);
      await transferBroker.makeTransfer();
      message = `Transfer Complete at ${new Date().toLocaleTimeString()}`;
    }
    if (parentPort) {
      parentPort.postMessage(message);
    } else process.exit(0);
  } catch (e: any) {
    if (parentPort) {
      parentPort.postMessage(e.message);
    } else {
      console.error(e);
    }
    process.exit();
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
})();

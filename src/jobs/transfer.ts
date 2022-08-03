import { parentPort, workerData } from "worker_threads";
import { TransferBroker } from "../Transfer/TransferBroker.js";
import { getTransferJobById } from "../db/queries.js";

(async () => {
  try {
    let message: string;
    const transferData = getTransferJobById(workerData.job.worker.workerData);
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
  } catch (e) {
    console.log(e);
    process.exit();
  }
})();

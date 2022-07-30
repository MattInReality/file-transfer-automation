import { TransferBroker } from "../Transfer/TransferBroker.js";
import { parentPort } from "worker_threads";
import { connectionOptions } from "../jobs.temp.js";
import { fileURLToPath } from "url";

(async () => {
  try {
    const transferBroker = new TransferBroker({
      sourceOptions: {
        connectionType: "SFTP",
        connectionOptions,
      },
      remoteOptions: {
        connectionType: "LOCAL",
        connectionOptions: {},
      },
      sourceFile: "stockfile/stockfile.csv",
      destinationFile: fileURLToPath(
        new URL("../../download/stockfile.csv", import.meta.url)
      ),
    });
    await transferBroker.makeTransfer();
    if (parentPort)
      parentPort.postMessage(
        `Transfer Complete at ${new Date().toLocaleTimeString()}`
      );
    else process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit();
  }
})();

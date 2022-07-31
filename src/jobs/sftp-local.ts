import { TransferBroker } from "../Transfer/TransferBroker.js";
import { parentPort } from "worker_threads";
import { connectionOptions } from "../jobs.temp.js";
import { getPathRelativeToRoot } from "../helpers.js";

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
      sourcePath: "stockfile/stockfile.csv",
      // TODO: this function ultimately exists to cover the non-existence of a database and path values being stored properly. Move the getPath in to the data query for database persistence.
      destinationPath: getPathRelativeToRoot("download/stockFile.csv"),
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

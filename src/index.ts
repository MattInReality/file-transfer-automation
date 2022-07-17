import path from "path";
import { TransferJob, TransferBroker } from "./Transfer/TransferBroker";

export const connectionOptions = {
  host: process.env["HOST"],
  port: process.env["PORT"],
  username: process.env["USERNAME"],
  password: process.env["PASSWORD"],
};

const transferJob: TransferJob = {
  sourceOptions: {
    connectionType: "SFTP",
    connectionOptions,
  },
  remoteOptions: {
    connectionType: "LOCAL",
    connectionOptions: {},
  },
  sourceFile: "stockfile/stockfile.csv",
  destinationFile: path.resolve(__dirname, "../download/stockfile.csv"),
};

const connection = new TransferBroker(transferJob);

connection
  .makeTransfer()
  .then(() => {
    console.log("Job Done");
  })
  .catch((err: any) => console.log(err));

import { Connection } from "../Connections/Connection.js";
import {
  ConnectionFactory,
  ConnectionFactoryOptions,
} from "../Connections/ConnectionFactory.js";
import { TransferDuplexStream } from "./TransferDuplexStream.js";

export interface TransferJob {
  id: number;
  name?: string;
  sourceOptions: ConnectionFactoryOptions;
  remoteOptions: ConnectionFactoryOptions;
  sourcePath: string;
  destinationPath: string;
}

export class TransferBroker {
  private source: Connection;
  remote: Connection;
  sourceFile: string;
  destinationFile: string;
  transferDuplex: TransferDuplexStream;

  constructor(private transferJob: TransferJob) {
    this.sourceFile = transferJob.sourcePath;
    this.destinationFile = transferJob.destinationPath;
    this.transferDuplex = new TransferDuplexStream();
    this.source = ConnectionFactory.create(this.transferJob.sourceOptions);
    this.remote = ConnectionFactory.create(this.transferJob.remoteOptions);

    this.transferDuplex.on("error", (err) => {
      return this.error(err);
    });
  }

  makeTransfer = async (): Promise<void> => {
    try {
      await this.source.download(this.sourceFile, this.transferDuplex);
      await this.remote.upload(this.transferDuplex, this.destinationFile);
    } catch (err) {
      this.error(err);
    }
  };

  error = (err: any) => {
    throw new Error(err.message);
  };
}

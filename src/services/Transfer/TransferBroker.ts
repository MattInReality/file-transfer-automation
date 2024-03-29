import { Connection, ConnectionOptions } from "../Connections/Connection";
import { ConnectionFactory } from "../Connections/ConnectionFactory";
import { TransferDuplexStream } from "./TransferDuplexStream";

export interface Transfer {
  id: number;
  name?: string;
  sourceOptions: ConnectionOptions;
  remoteOptions: ConnectionOptions;
  sourcePath: string;
  remotePath: string;
}

export class TransferBroker {
  private source: Connection;
  remote: Connection;
  sourceFile: string;
  destinationFile: string;
  transferDuplex: TransferDuplexStream;

  constructor(private transferJob: Transfer) {
    this.sourceFile = transferJob.sourcePath;
    this.destinationFile = transferJob.remotePath;
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

import { Connection } from "../Connections/Connection";
import {
  ConnectionFactory,
  ConnectionFactoryOptions,
} from "../Connections/ConnectionFactory";
import { TransferDuplexStream } from "./TransferDuplexStream";

export interface TransferJob {
  sourceOptions: ConnectionFactoryOptions;
  remoteOptions: ConnectionFactoryOptions;
  sourceFile: string;
  destinationFile: string;
}

export class TransferBroker {
  private source: Connection;
  remote: Connection;
  sourceFile: string;
  destinationFile: string;
  private transferDuplex: TransferDuplexStream;

  constructor(private transferJob: TransferJob) {
    this.sourceFile = transferJob.sourceFile;
    this.destinationFile = transferJob.destinationFile;
    this.transferDuplex = new TransferDuplexStream();
    this.source = ConnectionFactory.create(this.transferJob.sourceOptions);
    this.remote = ConnectionFactory.create(this.transferJob.remoteOptions);
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
    this.source._close();
    if (this.remote) this.remote._close();
    throw new Error(err.message);
  };
}

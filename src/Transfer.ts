import Client from "ssh2-sftp-client";
import * as fs from "fs";
import * as path from "path";
import type { WriteStream } from "fs";

export interface ConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface ConnectionFactoryOptions {
  connectionType: string;
  connectionOptions: ConnectionOptions;
}

abstract class Connection {
  abstract open(): void;
  abstract close(): void;
  abstract transfer(path: string, to: WriteStream): Promise<void>;
}

export class SftpConnection implements Connection {
  private client: Client;
  constructor(private readonly connectionOptions: ConnectionOptions) {
    this.client = new Client();
    this.connectionOptions = connectionOptions;
  }

  open = async () => {
    return this.client.connect(this.connectionOptions);
  };

  close = async () => {
    return await this.client.end();
  };

  transfer = async (path: string, to: WriteStream) => {
    await this.open();
    await this.client.get(path, to);
    await this.close();
  };
}

export class ConnectionFactory {
  static create = (
    connectionFactoryOptions: ConnectionFactoryOptions
  ): Connection => {
    if (connectionFactoryOptions.connectionType === "SFTP") {
      return new SftpConnection(connectionFactoryOptions.connectionOptions);
    } else throw new Error("connectionType not recognised");
  };
}

const remotePath: string = "stockfile/stockfile.csv";
const writeStream = fs.createWriteStream(
  path.resolve(__dirname, "../download/stockfile.csv")
);

const connectionOptions: ConnectionOptions = {
  host: process.env['HOST'],
  port: process.env['PORT'],
  username: process.env['USERNAME'],
  password: process.env['PASSWORD'],
};

const demoConnectionOptions: ConnectionFactoryOptions = {
  connectionType: "SFTP",
  connectionOptions,
};

const connection = ConnectionFactory.create(demoConnectionOptions);

connection
  .transfer(remotePath, writeStream)
  .catch((err: any) => console.log(err));

import { Connection, ConnectionOptions } from "./Connection";
import * as ftp from "basic-ftp";
import { ReadStream, WriteStream } from "fs";
import type { Client } from "basic-ftp";

export class FtpConnection implements Connection {
  private client: Client;
  private readonly connectionOptions: ConnectionOptions;

  constructor(connectionOptions: ConnectionOptions) {
    this.client = new ftp.Client();
    this.connectionOptions = connectionOptions;
  }

  _open = async () => await this.client.access(this.connectionOptions);

  _close = async () => this.client.close();

  download = async (remotePath: string, to: WriteStream): Promise<void> => {
    await this._open();
    await this.client.downloadTo(to, remotePath);
    return await this._close();
  };

  upload = async (localPath: ReadStream, to: string): Promise<void> => {
    await this._open();
    await this.client.uploadFrom(localPath, to);
    return await this._close();
  };
}

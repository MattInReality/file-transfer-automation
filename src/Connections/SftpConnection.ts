import { Connection, ConnectionOptions } from "./Connection";
import Client from "ssh2-sftp-client";
import { Readable, Writable } from "stream";

export class SftpConnection implements Connection {
  private client: Client;

  constructor(private readonly connectionOptions: ConnectionOptions) {
    this.client = new Client();
    this.connectionOptions = connectionOptions;
  }

  _open = async () => this.client.connect(this.connectionOptions);

  _close = async () => await this.client.end();

  download = async (remotePath: string, to: Writable): Promise<void> => {
    await this._open();
    await this.client.get(remotePath, to);
    return await this._close();
  };

  upload = async (localPath: Readable, to: string): Promise<void> => {
    await this._open();
    await this.client.put(localPath, to);
    return await this._close();
  };
}

import { Connection, ConnectionOptions } from "./Connection.js";
import Client from "ssh2-sftp-client";
import { Readable, Writable } from "stream";

export class SftpConnection implements Connection {
  private client: Client;
  private readonly username: string | undefined;
  private readonly password: string | undefined;
  private readonly secure: boolean | undefined;
  private readonly host: string | undefined;
  private readonly port: number | undefined;

  constructor(private readonly connectionOptions: ConnectionOptions) {
    this.client = new Client();
    this.host = connectionOptions.host;
    this.username = connectionOptions.username;
    this.password = connectionOptions.password;
    this.port = connectionOptions.port ?? 22;
  }

  _open = async () =>
    this.client.connect({
      username: this.username,
      password: this.password,
      host: this.host,
      port: this.port,
    });

  _close = async () => await this.client.end();

  download = async (remotePath: string, to: Writable): Promise<void> => {
    try {
      await this._open();
      await this.client.get(remotePath, to);
      return;
    } catch (e: any) {
      console.error("sFtpConnection download error!");
      throw new Error(e.message);
    } finally {
      await this._close();
    }
  };

  upload = async (localPath: Readable, to: string): Promise<void> => {
    try {
      await this._open();
      await this.client.put(localPath, to);
      return;
    } catch (e: any) {
      console.error("sFtpConnection upload error!");
      throw new Error(e.message);
    } finally {
      await this._close();
    }
  };
}

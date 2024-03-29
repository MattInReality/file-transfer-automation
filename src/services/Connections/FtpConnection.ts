import { Connection, ConnectionOptions } from "./Connection";
import * as ftp from "basic-ftp";
import type { Client } from "basic-ftp";
import { Readable, Writable } from "stream";

export class FtpConnection implements Connection {
  private client: Client;
  private readonly user: string | undefined;
  private readonly password: string | undefined;
  private readonly secure: boolean | undefined;
  private readonly host: string | undefined;
  private readonly name: string;

  constructor(private readonly connectionOptions: ConnectionOptions) {
    this.client = new ftp.Client();
    this.user = connectionOptions.username ?? "";
    this.password = connectionOptions.password ?? "";
    this.host = connectionOptions.host;
    this.secure = connectionOptions.secure ?? undefined;
    this.name = connectionOptions.name;
    // this.client.ftp.verbose = true;
  }

  _open = async () => {
    await this.client.access({
      host: this.host,
      user: this.user,
      password: this.password,
      secure: this.secure,
    });
  };

  _close = async () => {
    return this.client.close();
  };

  download = async (remotePath: string, to: Writable): Promise<void> => {
    try {
      await this._open();
      await this.client.downloadTo(to, remotePath);
      return;
    } catch (e: any) {
      console.error("ftpConnection download error!");
      throw new Error(e.message);
    } finally {
      await this._close();
    }
  };

  upload = async (_localPath: Readable, _to: string): Promise<void> => {
    try {
      await this._open();
      return;
    } catch (e: any) {
      console.error("ftpConnection upload error!");
      throw new Error(e.message);
    } finally {
      await this._close();
    }
  };
  test = async (
    _directory: string = "/"
  ): Promise<[string | undefined, string | undefined]> => {
    try {
      await this._open();
      return [`${this.name} connected successfully`, undefined];
    } catch (e: any) {
      return [undefined, e.message];
    } finally {
      await this._close();
    }
  };
}

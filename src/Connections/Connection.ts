import { Readable, Writable } from "stream";

export abstract class Connection {
  abstract _open(): void;

  abstract _close(): void;

  abstract download(remotePath: string, to: Writable): Promise<void>;

  abstract upload(localPath: Readable, to: string): Promise<void>;
}

export interface ConnectionOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  secure?: boolean;
  apiKey?: string;
}

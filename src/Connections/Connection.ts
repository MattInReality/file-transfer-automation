import { Readable, Writable } from "stream";

export abstract class Connection {
  abstract _open(): void;

  abstract _close(): void;

  abstract download(remotePath: string, to: Writable): Promise<void>;

  abstract upload(localPath: Readable, to: string): Promise<void>;
}

// What is the use of host in Local? What about protecting the application/server
export interface ConnectionOptions {
  connectionType: string;
  name: string;
  host: string;
  port?: number;
  username?: string;
  password?: string;
  secure?: boolean;
  apiKey?: string;
}

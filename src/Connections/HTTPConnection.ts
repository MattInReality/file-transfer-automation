import { Connection, ConnectionOptions } from "./Connection.js";
import fetch from "node-fetch";
import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";
import path from "path";
export class HTTPConnection implements Connection {
  private readonly baseUrl: string;
  constructor(private readonly connectionOptions: ConnectionOptions) {
    this.baseUrl = connectionOptions.host;
  }

  _open() {}

  _close() {}

  download = async (remotePath: string, to: Writable): Promise<void> => {
    //TODO: expand upon the request to add authentication properties and headers
    const response = await fetch(path.join(this.baseUrl, remotePath));
    if (!response.ok || response.body === null) {
      throw new Error(`Error downloading from remote: ${remotePath}`);
    }

    return pipeline(response.body, to);
  };

  upload = async (localPath: Readable, to: string): Promise<void> => {
    const url = `${this.baseUrl}${to}`;
    const response = await fetch(url, {
      method: "POST",
      body: localPath,
    });
    if (!response.ok) {
      throw new Error(
        `Error uploading to remote: ${url} - STATUS: ${response.status} - RESPONSE: ${response.body}`
      );
    }
  };
}

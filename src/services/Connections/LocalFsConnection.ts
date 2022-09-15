import { Connection, ConnectionOptions } from "./Connection";
import { open } from "fs/promises";
import { pipeline } from "stream/promises";
import { Readable, Writable } from "stream";
import path from "path";

export class LocalFsConnection implements Connection {
  private readonly baseUrl: string;
  constructor(private readonly connectionOptions: ConnectionOptions) {
    this.baseUrl = connectionOptions.host;
  }
  _open() {
    return Promise.resolve();
  }

  _close() {
    return Promise.resolve();
  }

  upload = async (localPath: Readable, to: string): Promise<void> => {
    let writeStream;
    try {
      const file = await open(path.join(this.baseUrl, to), "w");
      writeStream = file.createWriteStream();
      await pipeline(localPath, writeStream);
      return;
    } catch (e: any) {
      console.error("LocalFSConnection upload error!");
      throw new Error(e.message);
    } finally {
      await writeStream?.close();
    }
  };

  download = async (remotePath: string, to: Writable): Promise<void> => {
    let readStream;
    try {
      const file = await open(path.join(this.baseUrl, remotePath));
      readStream = file.createReadStream();
      await pipeline(readStream, to);
      return;
    } catch (e: any) {
      console.error("LocalFSConnection download error!");
      throw new Error(e.message);
    } finally {
      await readStream?.close();
    }
  };
}

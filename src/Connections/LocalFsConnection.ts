import { Connection } from "./Connection.js";
import { open } from "fs/promises";
import { pipeline } from "stream/promises";
import { Readable, Writable } from "stream";

export class LocalFsConnection implements Connection {
  _open() {
    return Promise.resolve();
  }

  _close() {
    return Promise.resolve();
  }

  upload = async (localPath: Readable, to: string): Promise<void> => {
    let writeStream;
    try {
      const file = await open(to, "w");
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
      const file = await open(remotePath);
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

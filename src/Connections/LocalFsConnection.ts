import { Connection } from "./Connection";
import type { ReadStream, WriteStream } from "fs";
import { open } from "fs/promises";
import { pipeline } from "stream/promises";

export class LocalFsConnection implements Connection {
  _open() {}

  _close() {}

  upload = async (localPath: ReadStream, to: string): Promise<void> => {
    let writeStream;
    try {
      const file = await open(to, "w");
      writeStream = file.createWriteStream();
      return await pipeline(localPath, writeStream);
    } catch (e: any) {
      console.log("LocalFsConnection writeStream error");
      throw new Error(e.message);
    } finally {
      await writeStream?.close();
    }
  };

  download = async (remotePath: string, to: WriteStream): Promise<void> => {
    let readStream;
    try {
      const file = await open(remotePath);
      readStream = file.createReadStream();
      return await pipeline(readStream, to);
    } catch (e: any) {
      console.log("LocalFsConnection writeStream error");
      throw new Error(e.message);
    } finally {
      await readStream?.close();
    }
  };
}

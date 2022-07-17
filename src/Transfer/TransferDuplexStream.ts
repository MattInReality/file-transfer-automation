import { Duplex } from "stream";
import { DuplexOptions } from "stream";

export class TransferDuplexStream extends Duplex {
  constructor(private options?: DuplexOptions) {
    super(options);
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    this.push(chunk);
    callback();
  }

  _read(size: number) {
    super._read(size);
  }

  _final(callback: (error?: Error | null) => void) {
    this.push(null);
  }
}

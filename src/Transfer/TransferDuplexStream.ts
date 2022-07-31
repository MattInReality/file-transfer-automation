import { Duplex } from "stream";
import { DuplexOptions } from "stream";

export class TransferDuplexStream extends Duplex {
  constructor(private options?: DuplexOptions) {
    super(options);
  }

  override _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    this.push(chunk);
    callback();
  }

  override _read(size: number) {
    super._read(size);
  }

  override _final(callback: (error?: Error | null) => void) {
    this.push(null);
    callback();
  }
}

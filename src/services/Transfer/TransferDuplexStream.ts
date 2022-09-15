import { Duplex } from "stream";
import { DuplexOptions } from "stream";

export class TransferDuplexStream extends Duplex {
  private data: string;
  constructor(private options?: DuplexOptions) {
    super(options);
    this.data = "";
  }

  override _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    this.push(chunk);
    callback();
  }

  override _read(size: number) {}

  override _final(callback: (error?: Error | null) => void) {
    this.push(null);
    callback();
  }
}

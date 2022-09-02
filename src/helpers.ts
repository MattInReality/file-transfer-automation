import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { parentPort } from "worker_threads";

export const baseDir = dirname(fileURLToPath(new URL("./", import.meta.url)));

export const getPathRelativeToRoot = (directoryName: string): string => {
  return join(baseDir, directoryName);
};

export const jobWorkerMessageReceiver = (
  message: string,
  isError: boolean = false
): void => {
  if (parentPort) {
    return parentPort.postMessage(message);
  }
  if (isError) {
    console.error(message);
  } else {
    console.log(message);
  }
  process.exit(0);
};

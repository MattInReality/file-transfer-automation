import path, { join } from "path";
import { parentPort } from "worker_threads";

export const baseDir = path.resolve(__dirname, "../");

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

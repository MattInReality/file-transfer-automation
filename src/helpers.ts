import { fileURLToPath } from "url";
import { dirname, join } from "path";

export const baseDir = dirname(fileURLToPath(new URL("./", import.meta.url)));

export const getPathRelativeToRoot = (directoryName: string): string => {
  return join(baseDir, directoryName);
};

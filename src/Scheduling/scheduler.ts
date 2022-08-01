import Bree from "bree";
import { SHARE_ENV } from "worker_threads";
import { fileURLToPath } from "url";
import { appLogger } from "../logger.js";

const root = fileURLToPath(new URL("../jobs", import.meta.url).toString());

export default new Bree({
  root,
  worker: { env: SHARE_ENV },
  logger: appLogger,
});

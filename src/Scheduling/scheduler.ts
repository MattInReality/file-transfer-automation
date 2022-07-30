import Bree from "bree";
import { SHARE_ENV } from "worker_threads";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL("../jobs", import.meta.url).toString());

console.log(root);

export default new Bree({
  root,
  worker: { env: SHARE_ENV },
});

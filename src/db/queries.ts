import { jobDB } from "../transferJobs.temp.js";
// jobDB is temporary. Real db implementation required
import { TransferJob } from "../Transfer/TransferBroker.js";

export const getTransferJobById = (id: number): TransferJob | undefined => {
  return jobDB.find((j: TransferJob) => j.id === id);
};

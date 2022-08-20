import { jobDB } from "../src/transferJobs.temp";
// jobDB is temporary. Real prisma implementation required
import { Transfer } from "../src/Transfer/TransferBroker.js";

export const getTransferJobById = (id: number): Transfer | undefined => {
  return jobDB.find((j: Transfer) => j.id === id);
};

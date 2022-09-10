import { jobs } from "../transferJobs.temp";
import { RequiredJobParams } from "./Job";

//TODO: This when the prisma is attached this needs to query the prisma for the jobs.
export const getJobs = async (): Promise<RequiredJobParams[]> => {
  return Promise.resolve(jobs);
};

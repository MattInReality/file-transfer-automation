import path from "path";
import Bree from "bree";
import { SHARE_ENV } from "worker_threads";
import { appLogger } from "../logger.js";
import { jobs } from "../transferJobs.temp.js";
import { Job, RequiredJobParams } from "./Job.js";

const root = path.resolve(__dirname, "../jobs");

//TODO: This when the prisma is attached this needs to query the prisma for the jobs.
export const getJobs = async (): Promise<RequiredJobParams[]> => {
  return Promise.resolve(jobs);
};

const scheduler = new Bree({
  root,
  worker: { env: SHARE_ENV },
  logger: appLogger,
});
//TODO: Configuration should be done in the index file. The config object should be passed to this function and that means composing it.
//TODO: Read up on and add Graceful to config object
// https://github.com/forwardemail/forwardemail.net/blob/master/bree.js
// https://github.com/ladjs/graceful
export const initScheduler = async () => {
  const jobs = await getJobs();
  if (jobs.length < 1) return;
  for (const j of jobs) {
    const job = new Job(j);
    await scheduler.add(job.breeOptions());
  }
  return scheduler.start();
};

import Bree, { JobOptions } from "bree";
import { SHARE_ENV } from "worker_threads";
import { fileURLToPath } from "url";
import { appLogger } from "../logger.js";
import { getPathRelativeToRoot } from "../helpers.js";
import { jobs } from "../transferJobs.temp.js";

const root = fileURLToPath(new URL("../jobs", import.meta.url).toString());

//Supposed to be a basic structure for job creation but arguably unnecessary.
//TODO: Use this as guidance for Bree job creation for prisma storage.
//TODO: This needs expanding to have a DB ID which can be used in placed of Job Data
//TODO: We can also give it an explicit name in the db as an identifier
export interface Job {
  id: number;
  name: string;
  jobRunner: string;
  jobDataId: number;
  cron: string;
  timeout?: number;
  interval?: number;
}

//A bree job isn't the same and so I need to create a Bree Job from my job. Particular focus on the path...
//TODO: Is this a local data issue? Create the Bree job at input instead of parsing it.
const convertToBreeJob = (job: Job): JobOptions => {
  return {
    name: job.name,
    //TODO: Find a better way to provide an absolute path to jobs.
    path: getPathRelativeToRoot(`/build/jobs/${job.jobRunner}.js`),
    timeout: job.timeout ?? 0,
    cron: job.cron,
    worker: {
      workerData: {
        jobDataId: job.jobDataId,
        jobId: job.id,
      },
    },
  };
};
//TODO: This when the prisma is attached this needs to query the prisma for the jobs.
const getJobs = async (): Promise<Job[]> => {
  return Promise.resolve(jobs);
};

//TODO: When we move to storing jobs in DB don't forget to change the types here and bin off the conversion.
//TODO: Configuration should be done in the index file. The config object should be passed to this function and that means composing it.
//TODO: Read up on and add Graceful to config object
// https://github.com/forwardemail/forwardemail.net/blob/master/bree.js
// https://github.com/ladjs/graceful
export const initScheduler = async () => {
  const scheduler = new Bree({
    root,
    worker: { env: SHARE_ENV },
    logger: appLogger,
  });
  const jobs = await getJobs();
  if (jobs.length < 1) return;
  for (const job of jobs) {
    await scheduler.add(convertToBreeJob(job));
  }
  return scheduler.start();
};

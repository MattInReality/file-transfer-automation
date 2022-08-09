import Bree from "bree";
import { SHARE_ENV } from "worker_threads";
import { fileURLToPath } from "url";
import { appLogger } from "../logger.js";
import { getPathRelativeToRoot } from "../helpers.js";

const root = fileURLToPath(new URL("../jobs", import.meta.url).toString());

//TODO: Read up on and add Graceful
// https://github.com/forwardemail/forwardemail.net/blob/master/bree.js
// https://github.com/ladjs/graceful
export const scheduler = new Bree({
  root,
  worker: { env: SHARE_ENV },
  logger: appLogger,
});

//Supposed to be a basic structure for job creation but arguably unnecessary.
//TODO: Use this as guidance for Bree job creation for db storage.
export interface AppJob {
  jobType: string;
  jobDataId: number;
  cron: string;
  timeout?: number;
  interval?: number;
}

//A bree job isn't the same and so I need to create a Bree Job from my job. Particular focus on the path...
//TODO: Is this a local data issue? Create the Bree job at input instead of parsing it.
const convertToBreeJob = (job: AppJob) => {
  return {
    name: `${job.jobType}-${job.jobDataId}`,
    path: getPathRelativeToRoot(`/build/jobs/${job.jobType}.js`),
    timeout: job.timeout ?? 0,
    cron: job.cron,
    worker: {
      workerData: job.jobDataId,
    },
  };
};

//TODO: When we move to storing jobs in DB don't forget to change the types here and bin off the conversion.
export const initJobs = async (jobs: AppJob[], scheduler: Bree) => {
  if (jobs.length < 1) return;
  for (const job of jobs) {
    await scheduler.add(convertToBreeJob(job));
  }
};

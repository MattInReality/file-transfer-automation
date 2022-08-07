import Bree from "bree";
import { SHARE_ENV } from "worker_threads";
import { fileURLToPath } from "url";
import { appLogger } from "../logger.js";
import { getPathRelativeToRoot } from "../helpers.js";

const root = fileURLToPath(new URL("../jobs", import.meta.url).toString());

export const scheduler = new Bree({
  root,
  worker: { env: SHARE_ENV },
  logger: appLogger,
});

export interface AppJob {
  jobType: string;
  jobDataId: number;
  cron?: string;
  timeout?: number;
}

export const initJobs = async (jobs: AppJob[], scheduler: Bree) => {
  for (const job of jobs) {
    await scheduler.add({
      name: `${job.jobType}-${job.jobDataId}`,
      path: getPathRelativeToRoot(`/build/jobs/${job.jobType}.js`),
      cron: job.cron || undefined,
      timeout: job.timeout || undefined,
      worker: {
        workerData: job.jobDataId,
      },
    });
  }
};

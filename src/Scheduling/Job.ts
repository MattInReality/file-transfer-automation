import path from "path";
import { JobParams } from "@prisma/client";
import { JobOptions } from "bree";

export type RequiredJobParams = Required<
  Pick<JobParams, "name" | "jobDataId" | "id" | "jobRunner">
> &
  Partial<Omit<JobParams, "name" | "jobDataId" | "id" | "jobRunner">>;

export class Job {
  constructor(public jobParams: RequiredJobParams) {}

  get breeOptions(): JobOptions {
    return {
      name: this.jobParams.name || "",
      //TODO: How can I add an error check for file existence on a worker.
      path: path.join(
        path.resolve(__dirname, "../jobs"),
        `${this.jobParams.jobRunner}.js`
      ),
      timeout: this.jobParams.timeout ?? 0,
      cron: this.jobParams.cron ?? undefined,
      worker: {
        workerData: {
          jobDataId: this.jobParams.jobDataId,
          jobId: this.jobParams.id,
        },
      },
    };
  }
}

import { JobParams } from "@prisma/client";
import { JobOptions } from "bree";
import { fileURLToPath } from "url";

export type RequiredJobParams = Required<
  Pick<JobParams, "name" | "jobDataId" | "id" | "jobRunner">
> &
  Partial<Omit<JobParams, "name" | "jobDataId" | "id" | "jobRunner">>;

export class Job {
  constructor(public jobParams: RequiredJobParams) {}

  breeOptions = (): JobOptions => {
    return {
      name: this.jobParams.name || "",
      path: fileURLToPath(
        new URL(`../jobs/${this.jobParams.jobRunner}.js`, import.meta.url)
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
  };
}

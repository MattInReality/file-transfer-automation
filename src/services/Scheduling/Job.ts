import path from "path";
import { JobParams } from "@prisma/client";
import { JobOptions } from "bree";
import { getPathRelativeToRoot } from "../../utils/helpers";

export type RequiredJobParams = Required<
  Pick<JobParams, "name" | "jobDataId" | "id" | "jobRunner">
> &
  Partial<Omit<JobParams, "name" | "jobDataId" | "id" | "jobRunner">>;

export class Job {
  constructor(public jobParams: RequiredJobParams) {}

  get breeOptions(): JobOptions {
    return {
      name: this.jobParams.name || "",
      path: path.join(
        getPathRelativeToRoot("./jobs"),
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

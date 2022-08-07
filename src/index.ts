import { scheduler, initJobs, AppJob } from "./Scheduling/scheduler.js";

const jobs: AppJob[] = [
  {
    jobType: "transfer",
    jobDataId: 1,
    cron: "*/2 * * * *",
  },
  {
    jobType: "transfer",
    jobDataId: 2,
    cron: "*/2 * * * *",
    timeout: 30000,
  },
];

await initJobs(jobs, scheduler);

await scheduler.start().catch((err) => {
  console.log(err.message);
});

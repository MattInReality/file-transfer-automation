import scheduler from "./Scheduling/scheduler.js";

await scheduler.add({
  name: "transfer",
  cron: "*/2 * * * *",
  worker: { workerData: 1 },
});
await scheduler.start();

import scheduler from "./Scheduling/scheduler.js";

await scheduler.add({ name: "sftp-local", cron: "*/2 * * * *" });
await scheduler.start();

import { initScheduler } from "./Scheduling/scheduler.js";

await initScheduler().catch((e: any) => {
  console.log(e.message);
});

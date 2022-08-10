import { initScheduler } from "./Scheduling/scheduler.js";

await initScheduler().catch((e: any) => {
  console.error(e.message);
});

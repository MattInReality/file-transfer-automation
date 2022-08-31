import { initScheduler } from "./Scheduling/scheduler.js";
import build from "./api.js";

process.on("unhandledRejection", (error) => {
  console.error(error);
});

const server = build({
  logger: true,
});

await initScheduler().catch((e: any) => {
  console.error(e.message);
});

await server.listen({ port: 3000 });

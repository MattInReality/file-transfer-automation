import path from "path";
import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { SHARE_ENV } from "worker_threads";

//Plugins
import prismaPlugin from "./plugins/prisma";
import FastifyBree from "fastify-bree";

//Routes
import { routes } from "./routes/index.routes";
import { appLogger } from "./logger.js";
import { Job } from "./Scheduling/Job.js";
import { getJobs } from "./Scheduling/scheduler.js";

const root = path.resolve(__dirname, "./jobs");

const build = function (opts = {}) {
  const app: FastifyInstance = Fastify(opts);

  app.register(prismaPlugin);
  app.register(FastifyBree, {
    customOptions: {
      root,
      worker: { env: SHARE_ENV },
      logger: appLogger,
      doRootCheck: true,
    },
    autoStart: false,
  });

  app.addHook("onReady", async function () {
    const jobs = await getJobs();
    if (jobs.length < 1) return;
    for (const j of jobs) {
      const job = new Job(j);
      console.log(job);
      await app.bree.add(job.breeOptions());
    }
    app.bree.on("error", (err) => {
      app.log.info(err);
    });
    return await app.bree.start();
  });

  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: "Hello World" };
  });

  app.register(routes, { prefix: "/api" });

  return app;
};

export default build;

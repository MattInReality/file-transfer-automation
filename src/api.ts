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
import { appLogger } from "./logger";
import { Job } from "./Scheduling/Job";

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
    const jobs = await app.prisma.jobParams.findMany({
      where: {
        active: true,
      },
    });
    if (jobs.length < 1) return;
    for (const j of jobs) {
      const job = new Job(j);
      await app.bree.add(job.breeOptions);
    }
    app.bree.on("error", (err) => {
      app.log.info(err);
    });
    return await app.bree.start();
  });

  app.addHook("onClose", async function () {
    await app.bree.stop();
  });

  app.get("/", async (_request: FastifyRequest, _reply: FastifyReply) => {
    return { message: "Hello World" };
  });

  app.register(routes, { prefix: "/api" });

  return app;
};

export default build;

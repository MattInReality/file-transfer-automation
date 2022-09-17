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
import jobUtils from "./plugins/job.utils";

//Routes
import { routes } from "./routes/index.routes";
import { appLogger } from "./services/logger";
import { Job } from "./services/Scheduling/Job";

const root = path.resolve(__dirname, "./jobs");

const build = function (opts = {}) {
  const fastify: FastifyInstance = Fastify(opts);

  fastify.register(prismaPlugin);
  fastify.register(FastifyBree, {
    customOptions: {
      root,
      worker: { env: SHARE_ENV },
      logger: appLogger,
      doRootCheck: true,
    },
    autoStart: false,
  });
  fastify.register(jobUtils);

  fastify.addHook("onReady", async function () {
    const jobs = await fastify.prisma.jobParams.findMany({
      where: {
        active: true,
      },
    });
    if (jobs.length < 1) return;
    for (const j of jobs) {
      const job = new Job(j);
      try {
        await fastify.bree.add(job.breeOptions);
      } catch (e: any) {
        // If anything goes wrong with a job on start I want the job made inactive and updated with the error message and made inactive.

        await fastify.jobUtils.handleBadJob(j, e);
      }
    }
    return await fastify.bree.start();
  });

  fastify.addHook("onClose", async function () {
    await fastify.bree.stop();
  });

  fastify.get("/", async (_request: FastifyRequest, _reply: FastifyReply) => {
    return { message: "Hello World" };
  });

  fastify.register(routes, { prefix: "/api" });

  return fastify;
};

export default build;

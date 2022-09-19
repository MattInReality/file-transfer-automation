import path from "path";
import Fastify, {
  FastifyError,
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
  fastify.setErrorHandler(function (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    // Handling Prisma Errors - sorry for the wall of references.
    if (error?.code.charAt(0) === "P") {
      const codeMap: { [key: string]: number } = {
        P2000: 400,
        P2001: 404,
        P2002: 409,
        P2003: 409,
        P2004: 409,
        P2005: 400,
        P2006: 400,
        P2007: 400,
        P2008: 500,
        P2009: 500,
        P2010: 500,
        P2011: 409,
        P2012: 400,
        P2013: 400,
        P2014: 400,
        P2015: 500,
        P2016: 500,
        P2017: 400,
        P2018: 404,
        P2019: 400,
        P2020: 400,
        P2021: 404,
        P2022: 404,
        P2023: 400,
        P2024: 408,
        P2025: 400,
        P2027: 500,
        P2030: 501,
        P2031: 501,
        P2033: 400,
      };

      const errorMap: { [key: number]: string } = {
        400: "Bad Request",
        404: "Not Found",
        408: "Request Timeout",
        409: "Conflict",
        500: "Internal Server Error",
        501: "Not Implemented",
      };

      const errorCode = codeMap[error.code];
      const errorName = errorMap[errorCode];

      fastify.log.error(`Prisma Code: ${error.code}: ${error.message}`);

      reply.code(errorCode);
      return reply.send({
        statusCode: errorCode,
        error: errorName,
        //@ts-ignore because prisma is throwing these errors regardless.
        message: error.meta.cause ?? "Entity not found",
      });
    } else {
      const statusCode = error.statusCode || 500;
      if (statusCode >= 500) {
        fastify.log.error(error);
      } else if (statusCode >= 400) {
        fastify.log.info(error);
      } else {
        fastify.log.error(error);
      }
      reply.code(statusCode);
      return reply.send(error);
    }
  });
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

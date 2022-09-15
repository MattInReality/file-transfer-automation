import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { JobParams } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    jobUtils: { handleBadJob: (job: JobParams, err: any) => void };
  }
}

const jobUtils: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  const handleBadJob = async (job: JobParams, error: any) => {
    await fastify.prisma.jobParams.update({
      where: {
        id: job.id,
      },
      data: {
        active: false,
        lastFailedAt: new Date(),
        lastFailErrorMessage: error.message || "Configuration Error",
      },
    });
    fastify.log.warn(
      `Job ${job.id}: ${job.name} has a configuration error and will has been made inactive.`
    );
  };
  fastify.decorate("jobUtils", { handleBadJob });
});

export default jobUtils;

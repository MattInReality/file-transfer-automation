import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { PrismaClient, JobParams } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    jobUtils: { handleBadJob: (job: JobParams, err: any) => void };
  }
}

const prismaPlugin: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance, _options) => {
    const prisma = new PrismaClient();

    await prisma.$connect();

    fastify.decorate("prisma", prisma);

    fastify.addHook("onClose", async (server) => {
      await server.prisma.$disconnect();
    });
  }
);

export default prismaPlugin;

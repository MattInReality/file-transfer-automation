import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { connectionRoutes } from "./connection.routes";
import { transferRoutes } from "./transfer.routes";
import { jobRoutes } from "./jobs.routes";

export const routes = async function (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  fastify.register(connectionRoutes, { prefix: "/connections" });
  fastify.register(transferRoutes, { prefix: "/transfers" });
  fastify.register(jobRoutes, { prefix: "/jobs" });
};

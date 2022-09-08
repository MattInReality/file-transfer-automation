import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { connectionRoutes } from "./connection.routes.js";
import { transferRoutes } from "./transfer.routes.js";
import { jobRoutes } from "./jobs.routes.js";

export const routes = async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.register(connectionRoutes, { prefix: "/connections" });
  fastify.register(transferRoutes, { prefix: "/transfers" });
  fastify.register(jobRoutes, { prefix: "/jobs" });
};

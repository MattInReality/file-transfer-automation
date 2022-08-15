import Fastify, { FastifyInstance } from "fastify";
import { connections } from "./routes/connections.js";
import fastifyObjectionjs from "fastify-objectionjs";
import knexFile from "./knexFile.js";

const build = function (opts = {}) {
  const app: FastifyInstance = Fastify(opts);

  app.register(fastifyObjectionjs, { knexConfig: knexFile["development"] });

  app.get("/", async (request, reply) => {
    return { message: "Hello World" };
  });

  app.register(connections, { prefix: "/connections" });

  return app;
};

export default build;

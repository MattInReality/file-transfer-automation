import Fastify, { fastify, FastifyInstance } from "fastify";
import { connections } from "./routes/connections.js";

const build = function (opts = {}) {
  const app: FastifyInstance = Fastify(opts);

  app.get("/", async (request, reply) => {
    return { message: "Hello World" };
  });

  app.register(connections, { prefix: "/connections" });

  return app;
};

export default build;

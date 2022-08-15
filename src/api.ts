import Fastify, { FastifyInstance } from "fastify";

const build = function (opts = {}) {
  const app: FastifyInstance = Fastify(opts);

  app.get("/", async (request, reply) => {
    return { message: "Hello World" };
  });

  return app;
};

export default build;

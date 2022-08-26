import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";

//Plugins
import prismaPlugin from "./plugins/prisma.js";

//Routes
import { routes } from "./routes/index.routes.js";

const build = function (opts = {}) {
  const app: FastifyInstance = Fastify(opts);

  app.register(prismaPlugin);

  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: "Hello World" };
  });

  app.register(routes, { prefix: "/api" });

  return app;
};

export default build;

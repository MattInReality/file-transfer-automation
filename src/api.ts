import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { connections } from "./routes/connections.js";
import prismaPlugin from "./plugins/prisma.js";

const build = function (opts = {}) {
  const app: FastifyInstance = Fastify(opts);

  app.register(prismaPlugin);

  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: "Hello World" };
  });

  app.register(connections, { prefix: "/connections" });

  return app;
};

export default build;

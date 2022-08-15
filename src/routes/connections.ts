import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const connections = async function routes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get("/", async (request, reply) => {
    return { message: "Hello from connections root" };
  });
  fastify.post("/", async (request, reply) => {
    return { message: "Posted to the connections" };
  });
  fastify.get("/:id", async (request, reply) => {
    return { message: "Getting something from connections" };
  });
  fastify.put("/:id", async (request, reply) => {
    return { message: "Put in the connections" };
  });
  fastify.delete("/:id", async (request, reply) => {
    return { message: "Deleted from connections" };
  });
};

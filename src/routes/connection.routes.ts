import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { Connection, Prisma } from "@prisma/client";

export const connectionRoutes = async function routes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.addSchema({
    $id: "connection",
    type: "object",
    properties: {
      connectionType: { type: "string" },
      name: { type: "string" },
      host: { type: "string" },
      port: { type: "integer" },
      username: { type: "string" },
      password: { type: "string" },
      apiKey: { type: "string" },
      secure: { type: "boolean" },
    },
    required: ["name", "host", "connectionType"],
  });
  fastify.get("/", {
    schema: {
      response: {
        200: {
          description: "Get all connections",
          type: "array",
          items: {
            $ref: "connection#",
          },
        },
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return await fastify.prisma.connection.findMany({});
    },
  });

  fastify.post("/", {
    schema: {
      response: {
        201: {
          description: "Create a new connection",
          type: "object",
          $ref: "connection#",
        },
      },
      body: {
        $ref: "connection#",
      },
    },
    handler: async (
      request: FastifyRequest<{
        Body: Connection;
      }>,
      reply: FastifyReply
    ) => {
      const data: Prisma.ConnectionCreateInput = request.body;

      return await fastify.prisma.connection.create({
        data,
      });
    },
  });

  fastify.get("/:id", {
    schema: {
      response: {
        201: {
          description: "Get a specific connection",
          type: "object",
          $ref: "connection#",
        },
      },
      params: {
        id: { type: "number" },
      },
    },

    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      // Query to view a specific connection.
      const id = request.params.id;
      return await fastify.prisma.connection.findUnique({
        where: { id: id },
      });
    },
  });

  fastify.put("/:id", {
    schema: {
      response: {
        204: {
          description: "Updates a connection",
          type: "object",
          $ref: "connection#",
        },
      },
      params: {
        id: { type: "number" },
      },
      body: {
        $ref: "connection#",
      },
    },
    handler: async (
      request: FastifyRequest<{
        Params: { id: number };
        Body: Connection;
      }>,
      reply: FastifyReply
    ) => {
      let data: Prisma.ConnectionUpdateInput = request.body;

      return await fastify.prisma.connection.update({
        data,
        where: {
          id: request.params.id,
        },
      });
    },
  });

  fastify.delete("/:id", {
    schema: {
      response: {
        200: {
          description: "Delete a connection",
          type: "object",
        },
      },
      params: {
        id: { type: "number" },
      },
    },

    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      // Query to view a specific connection.
      const id = request.params.id;
      await fastify.prisma.connection.delete({
        where: { id: id },
      });
      return {};
    },
  });
};

import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { Prisma } from "@prisma/client";

export const connections = async function routes(
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
          type: "object",
          properties: {
            connections: {
              type: "array",
            },
          },
        },
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const connections = await fastify.prisma.connection.findMany({});
      return { connections };
    },
  });

  fastify.post("/", {
    schema: {
      response: {
        201: {
          description: "Create a new connection",
          type: "object",
          properties: {
            connection: { $ref: "connection#" },
          },
        },
      },
      body: {
        type: "object",
        properties: {
          connection: { $ref: "connection#" },
        },
      },
    },
    handler: async (
      request: FastifyRequest<{
        Body: { connection: Prisma.ConnectionCreateInput };
      }>,
      reply: FastifyReply
    ) => {
      const { connection } = request.body;
      const transferEndPoint = await fastify.prisma.connection.create({
        data: connection,
      });
      return { message: "Connection Created", connection: transferEndPoint };
    },
  });

  fastify.get("/:id", {
    schema: {
      response: {
        201: {
          description: "Get a specific connection",
          type: "object",
          properties: {
            connection: { $ref: "connection#" },
          },
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
          properties: {
            connection: { $ref: "connection#" },
          },
        },
      },
      params: {
        id: { type: "number" },
      },
      body: {
        connection: { $ref: "connection#" },
      },
    },
    handler: async (
      request: FastifyRequest<{
        Params: { id: number };
        Body: { connection: Prisma.ConnectionUpdateInput };
      }>,
      reply: FastifyReply
    ) => {
      const connection = fastify.prisma.connection.update({
        where: {
          id: request.params.id,
        },
        data: request.body.connection,
      });
      return { connection };
    },
  });

  fastify.delete("/:id", {
    schema: {
      response: {
        200: {
          description: "Delete a connection",
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
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
      return { message: "Connection Deleted" };
    },
  });
};

import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { Connection, Prisma } from "@prisma/client";
import { getPathRelativeToRoot } from "../helpers";
import { ConnectionFactory } from "../services/Connections/ConnectionFactory";

export const connectionRoutes = async function routes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  fastify.addSchema({
    $id: "connection",
    type: "object",
    properties: {
      id: { type: "number" },
      connectionType: { type: "string" },
      name: { type: "string" },
      host: { type: "string" },
      port: { type: "integer" },
      username: { type: "string" },
      password: { type: "string" },
      apiKey: { type: "string" },
      secure: { type: "boolean" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
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
    handler: async (_request: FastifyRequest, _reply: FastifyReply) => {
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
      _reply: FastifyReply
    ) => {
      const data: Prisma.ConnectionCreateInput = request.body;
      //TODO: Find a better place for this logic.
      if (request.body.connectionType.toLowerCase() === "local") {
        data.host = getPathRelativeToRoot("../download");
      }
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
      querystring: {
        test: {
          type: "string",
        },
      },
    },

    handler: async (
      request: FastifyRequest<{
        Params: { id: number };
        Querystring: { test: string };
      }>,
      reply: FastifyReply
    ) => {
      const id = request.params.id;

      const connection = await fastify.prisma.connection.findUnique({
        where: { id: id },
      });

      if (!connection) {
        reply.status(404);
        return { message: "Connection not found" };
      }
      return connection;
    },
  });

  fastify.get("/test/:id", {
    schema: {
      params: {
        id: {
          type: "integer",
        },
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      const connectionOptions = await fastify.prisma.connection.findUnique({
        where: { id: request.params.id },
      });

      if (!connectionOptions) {
        reply.status(400);
        return { message: "Connection not found" };
      }

      const connection = ConnectionFactory.create(connectionOptions);
      const [success, err] = await connection.test("/");
      if (err) {
        reply.status(404);
        return { message: err };
      }
      return { message: success };
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
      _reply: FastifyReply
    ) => {
      const data: Prisma.ConnectionUpdateInput = request.body;
      if (request.body.connectionType.toLowerCase() === "local") {
        data.host = getPathRelativeToRoot("../download");
      }
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
      _reply: FastifyReply
    ) => {
      const id = request.params.id;
      await fastify.prisma.connection.delete({
        where: { id: id },
      });
      return {};
    },
  });
};

import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { Prisma } from "@prisma/client";

type transferEndPointNestedCreateSchema = {
  Body: {
    transferEndPoint: {
      connectionType: string;
      connectionOptions: Prisma.ConnectionCreateWithoutTransferEndPointsInput;
    };
  };
};

export const connections = async function routes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get("/", async (request, reply) => {
    // Query for id and name of all connection
    const connections = await fastify.prisma.connection.findMany();
    return { message: "Hello from connections root", connections };
  });

  fastify.post("/", {
    schema: {
      body: {
        type: "object",
        properties: {
          transferEndPoint: {
            type: "object",
            properties: {
              connectionType: {
                type: "string",
              },
              connectionOptions: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  host: { type: "string" },
                  port: { type: "integer" },
                  username: { type: "string" },
                  password: { type: "string" },
                  apiKey: { type: "string" },
                  secure: { type: "boolean" },
                },
                required: ["name", "host"],
              },
            },
          },
        },
      },
    },
    handler: async (
      request: FastifyRequest<transferEndPointNestedCreateSchema>,
      reply: FastifyReply
    ) => {
      const { connectionType, connectionOptions } =
        request.body.transferEndPoint;
      const transferEndPoint = await fastify.prisma.transferEndPoint.create({
        data: {
          connectionType,
          connectionOptions: {
            create: connectionOptions,
          },
        },
        include: {
          connectionOptions: true,
        },
      });
      return { message: "Connection Created", connection: transferEndPoint };
    },
  });

  fastify.get("/:id", async (request, reply) => {
    // Query to view a specific connection.
    return { message: "Getting something from connections" };
  });

  fastify.put("/:id", async (request, reply) => {
    // Query to update a specific connection
    return { message: "Put in the connections" };
  });

  fastify.delete("/:id", async (request, reply) => {
    // Query to delete a connection - should not delete if used in a job
    return { message: "Deleted from connections" };
  });
};

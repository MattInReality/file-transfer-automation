import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { Prisma, Transfer } from "@prisma/client";

export const transferRoutes = async function (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  fastify.addSchema({
    $id: "transfer",
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      sourceOptionsId: { type: "integer" },
      //TODO: sourceOptions and remoteOptions need to reference the connection schema which will need making available to this out
      sourceOptions: { type: "object" },
      remoteOptionsId: { type: "integer" },
      remoteOptions: { type: "object" },
      sourcePath: { type: "string" },
      remotePath: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
    },
    required: ["name", "sourcePath", "remotePath"],
    oneOf: [
      {
        required: ["sourceOptionsId", "remoteOptionsId"],
      },
      {
        required: ["sourceOptions", "remoteOptions"],
      },
    ],
  });

  fastify.get("/", {
    schema: {
      response: {
        200: {
          description: "Get all transfer records",
          type: "array",
          items: {
            $ref: "transfer#",
          },
        },
      },
    },
    handler: async (_request: FastifyRequest, _reply: FastifyReply) => {
      return await fastify.prisma.transfer.findMany();
    },
  });

  fastify.post("/", {
    schema: {
      response: {
        201: {
          description: "Create a new transfer record",
          $ref: "transfer#",
        },
      },
      body: {
        $ref: "transfer#",
      },
    },
    handler: async (
      request: FastifyRequest<{
        Body: Transfer;
      }>,
      _reply: FastifyReply
    ) => {
      const transfer = request.body;
      let data: Prisma.TransferCreateInput;

      data = {
        name: transfer.name,
        sourcePath: transfer.sourcePath,
        remotePath: transfer.remotePath,
        sourceOptions: {
          connect: {
            id: transfer.sourceOptionsId,
          },
        },
        remoteOptions: {
          connect: {
            id: transfer.remoteOptionsId,
          },
        },
      };

      return await fastify.prisma.transfer.create({
        data,
      });
    },
  });

  fastify.get("/:id", {
    schema: {
      response: {
        200: {
          description: "Get a specific transfer record by ID",
          $ref: "transfer#",
        },
      },
      params: {
        id: { type: "integer" },
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      _reply: FastifyReply
    ) => {
      return fastify.prisma.transfer.findUnique({
        where: {
          id: request.params.id,
        },
        include: {
          sourceOptions: {
            select: {
              name: true,
              id: true,
            },
          },
          remoteOptions: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
    },
  });

  fastify.put("/:id", {
    schema: {
      response: {
        204: {
          description: "Updated a specific transfer record by ID",
          $ref: "transfer#",
        },
      },
      params: {
        id: { type: "integer" },
      },
      body: {
        $ref: "transfer#",
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { id: number }; Body: Transfer }>,
      _reply: FastifyReply
    ) => {
      return fastify.prisma.transfer.update({
        //TODO: this needs consideration. The data received should be sourceOptionsId not the whole sourceOptions object.
        data: request.body,
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
          description: "Delete a transfer record by ID",
          type: "object",
        },
      },
      params: {
        id: {
          type: "integer",
        },
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      _reply: FastifyReply
    ) => {
      return fastify.prisma.transfer.delete({
        where: {
          id: request.params.id,
        },
      });
    },
  });
};

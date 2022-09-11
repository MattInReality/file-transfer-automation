import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import cronValidate from "cron-validate";
import { JobParams, Prisma } from "@prisma/client";
import { Job } from "../Scheduling/Job";

export const jobRoutes = async function (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  fastify.addSchema({
    $id: "job",
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      jobRunner: { type: "string" },
      jobDataId: { type: "integer" },
      cron: { type: "string" },
      timeout: { type: "integer" },
      interval: { type: "integer" },
      active: { type: "boolean" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
      lastRanAt: { type: "string" },
      lastFailedAt: { type: "string" },
      lastFailErrorMessage: { type: "string" },
    },
    required: ["name", "jobRunner", "jobDataId"],
  });
  fastify.get("/", {
    schema: {},
    handler: async (request: FastifyRequest, _reply: FastifyReply) => {
      return { message: "Hello from GET" };
    },
  });
  fastify.post("/", {
    schema: {
      body: {
        $ref: "job#",
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: JobParams }>,
      reply: FastifyReply
    ) => {
      const { name, jobRunner, jobDataId, cron, timeout, interval, active } =
        request.body;
      let data: Prisma.JobParamsCreateInput = {
        name,
        jobRunner,
        jobDataId,
        active,
      };

      if (cron) {
        const cronResult = cronValidate(cron);
        if (cronResult.isError()) {
          reply.status(400);
          throw new Error("Not a valid cron.");
        }
        data.cron = cronResult.getValue().toString();
      }

      data = {
        name,
        jobRunner,
        cron,
        timeout,
        interval,
        active,
        jobDataId,
      };

      const created = await fastify.prisma.jobParams.create({
        data,
      });

      if (created.active) {
        const job = new Job(created);
        await fastify.bree.add(job.breeOptions);
        await fastify.bree.start(job.breeOptions.name);
        return { message: `${created.name} started` };
      }

      return { message: `${created.name} added to the database` };
    },
  });
  fastify.get("/:id", {
    schema: {},
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return { message: "Hi, from GET one" };
    },
  });
  fastify.put("/:id", {
    schema: {},
    handler: async (request, reply) => {
      return { message: "Hi, PUT one" };
    },
  });
  fastify.delete("/:id", {
    schema: {},
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return { message: "Hi, DELETE one" };
    },
  });
};

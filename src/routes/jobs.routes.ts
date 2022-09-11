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
    schema: {
      response: {
        200: {
          description: "Returns a list of jobs",
          type: "array",
          items: {
            description: "Partial job data",
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              name: {
                type: "string",
              },
              lastRanAt: {
                type: "string",
              },
              lastFailedAt: {
                type: "string",
              },
              lastFailErrorMessage: {
                type: "string",
              },
            },
          },
        },
      },
      querystring: {
        active: {
          type: "boolean",
        },
        search: {
          type: "string",
        },
      },
    },
    handler: async (
      request: FastifyRequest<{
        Querystring: { active: boolean; search: string };
      }>,
      _reply: FastifyReply
    ) => {
      // Going to use the JSON shchema to control what data is returned. Even prisma says limiting horizontal data in the query doesn't save on performance unless the entity is huge.
      let query: Prisma.JobParamsFindManyArgs = {};

      // Allow for checking running jobs.
      if (request.query.active) {
        query.where = Object.assign(
          { ...query.where },
          {
            active: request.query.active,
          }
        );
      }
      // Searching jobs by name. Will likely only be useful much later on when there are lots of jobs running.
      if (request.query.search && request.query.search.length > 0) {
        query.where = Object.assign(
          { ...query.where },
          {
            name: {
              search: request.query.search,
            },
          }
        );
      }

      return fastify.prisma.jobParams.findMany(query);
    },
  });
  fastify.post("/", {
    schema: {
      response: {
        201: {
          description:
            "Successful insertion of job to the database and conditional job start",
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            jobRunner: { type: "string" },
            jobDataId: { type: "integer" },
            cron: { type: "string" },
            timeout: { type: "integer" },
            interval: { type: "integer" },
            active: { type: "boolean" },
          },
        },
      },
      body: {
        description: "User defined fields for a job",
        type: "object",
        properties: {
          name: { type: "string" },
          jobRunner: { type: "string" },
          jobDataId: { type: "integer" },
          cron: { type: "string" },
          timeout: { type: "integer" },
          interval: { type: "integer" },
          active: { type: "boolean" },
        },
        required: ["name", "jobRunner", "jobDataId", "active"],
        anyOf: [
          { required: ["cron"] },
          { required: ["timeout"] },
          { required: ["interval"] },
        ],
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

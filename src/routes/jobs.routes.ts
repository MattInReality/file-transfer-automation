import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import cronValidate from "cron-validate";
import { JobParams, Prisma } from "@prisma/client";
import { Job } from "../services/Scheduling/Job";

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
      // Going to use the JSON schema to control what data is returned. Even prisma says limiting horizontal data in the query doesn't save on performance unless the entity is huge.
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
            lastFailedAt: { type: "string" },
            lastFailErrorMessage: { type: "string" },
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
        timeout,
        interval,
      };
      // Check cron is valid and return early if not
      if (cron) {
        const cronResult = cronValidate(cron);
        if (cronResult.isError()) {
          reply.status(400);
          return {
            statusCode: 400,
            name: "Bad Request",
            message: "Not a valid cron.",
          };
        }
        data.cron = cron;
      }

      const created = await fastify.prisma.jobParams.create({
        data,
      });
      // The job needs to be added to bree, but if bree doesn't like it, it will throw an error that will crash the app.
      // Below we handle just that error and update the DB to make the job inactive and return the error to the user in the post response.
      if (created.active) {
        const job = new Job(created);
        try {
          await fastify.bree.add(job.breeOptions);
          await fastify.bree.start(job.breeOptions.name);
        } catch (e: any) {
          await fastify.jobUtils.handleBadJob(created, e);
        }
      }

      return created;
    },
  });

  fastify.get("/:id", {
    schema: {
      response: {
        200: {
          description: "Get a single job by ID",
          type: "object",
          properties: {
            id: { type: "number" },
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
        },
      },
      params: {
        id: {
          type: "number",
        },
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      const jobData = await fastify.prisma.jobParams.findUnique({
        where: {
          id: request.params.id,
        },
      });
      if (!jobData) {
        reply.status(404);
        return { message: "Job not found" };
      }
      return jobData;
    },
  });

  fastify.put("/:id", {
    schema: {
      response: {
        204: {
          description: "Update the details of a job",
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
            updatedAt: { type: "string" },
            lastFailedAt: { type: "string" },
            lastFailErrorMessage: { type: "string" },
          },
        },
      },
      params: {
        id: {
          type: "number",
        },
      },
      querystring: {
        type: "object",
        properties: {
          clearerrors: {
            type: "boolean",
          },
        },
      },
      body: {
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
        required: [
          "name",
          "jobRunner",
          "jobDataId",
          "cron",
          "timeout",
          "interval",
          "active",
        ],
      },
    },
    handler: async (
      request: FastifyRequest<{
        Params: { id: number };
        Querystring: { clearerrors: boolean };
        Body: JobParams;
      }>,
      reply: FastifyReply
    ) => {
      const originalState = await fastify.prisma.jobParams.findUnique({
        where: {
          id: request.params.id,
        },
      });

      if (!originalState) {
        reply.status(404);
        return {
          statusCode: 404,
          name: "Resource not found",
          message: "Job not found",
        };
      }

      if (originalState.active) {
        await fastify.bree.stop(originalState.name);
        await fastify.bree.remove(originalState.name);
      }

      const { name, jobRunner, jobDataId, cron, timeout, interval, active } =
        request.body || {};

      let data: Prisma.JobParamsUpdateInput = {
        name,
        jobRunner,
        jobDataId,
        timeout,
        interval,
        active,
      };
      if (cron) {
        const cronResult = cronValidate(cron);
        if (cronResult.isError()) {
          reply.status(400);
          return {
            statusCode: 400,
            name: "Bad Request",
            message: "Not a valid cron.",
          };
        }
        data.cron = cron;
      }
      if (request.query.clearerrors) {
        data.lastFailedAt = null;
        data.lastFailErrorMessage = null;
      }
      const updated = await fastify.prisma.jobParams.update({
        where: {
          id: request.params.id,
        },
        data,
      });

      if (updated.active) {
        const job = new Job(updated);
        if (updated.active) {
          try {
            await fastify.bree.add(job.breeOptions);
            await fastify.bree.start(job.breeOptions.name);
          } catch (e: any) {
            await fastify.jobUtils.handleBadJob(updated, e);
          }
        }
      }

      return updated;
    },
  });

  fastify.delete("/:id", {
    schema: {
      response: {
        200: {
          description:
            "Deleted a job by ID and remove it from the scheduler if running.",
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
      },
      params: {
        id: {
          type: "number",
        },
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      _reply: FastifyReply
    ) => {
      const deleted = await fastify.prisma.jobParams.delete({
        where: {
          id: request.params.id,
        },
      });

      if (deleted.active) {
        await fastify.bree.stop(deleted.name);
        await fastify.bree.remove(deleted.name);
      }

      return { message: "Job Deleted" };
    },
  });
};

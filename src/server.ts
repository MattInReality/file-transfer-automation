import build from "./api";
import Graceful from "@ladjs/graceful";
import { appLogger } from "./services/logger";

process.on("unhandledRejection", (error) => {
  console.error(error);
});

const server = build({
  logger:
    process.env.NODE_ENV !== "production" || process.env.APILOGGING === "true",
  ajv: {
    removeAdditional: "all",
  },
});

server.listen({ port: 3000 }).then(() => {
  console.log("Server Running on Port 3000");
});

const graceful = new Graceful({
  servers: [server],
  brees: [server.bree],
  logger: appLogger,
});

graceful.listen();

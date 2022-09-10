import build from "./api";

process.on("unhandledRejection", (error) => {
  console.error(error);
});

const server = build({
  logger: true,
});

server.listen({ port: 3000 }).then(() => {
  console.log("Server Running on Port 3000");
});

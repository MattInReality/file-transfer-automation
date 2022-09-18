import Cabin from "cabin";
import signale from "signale";
import pino from "pino";

const { Signale } = signale;

const env = process.env.NODE_ENV || "development";

const automationLogger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd hh:MM:ss",
      ignore: "hostname",
    },
  },
  customLevels: {
    log: 30,
  },
  hooks: {
    logMethod(inputArgs: any[], method: ({}) => void) {
      return method.call(this, {
        msg: inputArgs[0],
        meta: inputArgs[1],
      });
    },
  },
});

export const appLogger = new Cabin({
  axe: {
    logger: env === "production" ? automationLogger : new Signale(),
  },
});

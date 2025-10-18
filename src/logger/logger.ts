import { createLogger, format, transports, addColors } from "winston";

const myColors = {
  info: "green",
  debug: "blue",
  error: "red",
};

addColors(myColors);

const log = createLogger({
  level: "debug",
  format: format.combine(
    format.colorize({ all: true }), // <-- вот это нужно
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, stack }) => {
      return stack
        ? `${timestamp} [${level}]: ${message}\nStack: ${stack}`
        : `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

export const logger = {
  info: (msg: string) => log.info(msg),
  debug: (msg: any) =>
    log.debug(typeof msg === "string" ? msg : JSON.stringify(msg)),
  error: (err: any) => {
    if (err instanceof Error) log.error(err.message, err);
    else log.error(err);
  },
};

export default log;

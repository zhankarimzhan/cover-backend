// src/middleware/httpLogger.ts
import { Request, Response, NextFunction } from "express";
import log from "../logger/logger";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url } = req;
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    log.info(`${timestamp.split("T").join(" ").split("Z").join("")} ${method} ${url} ${status} - ${duration}ms`);
  });

  next();
};

// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import log from "../logger/logger";
import { HttpStatus } from "../constants/httpstatus";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  log.error(err);

  const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    status,
    message,
  });
  next()
}

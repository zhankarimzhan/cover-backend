import { Request } from "express";

/**
 * Собирает все параметры запроса (body, query, params) в один объект
 */
export function createBind(req: Request) {
  return {
    ...req.params,
    ...req.query,
    ...req.body,
    ...req.userinfo
  };
}

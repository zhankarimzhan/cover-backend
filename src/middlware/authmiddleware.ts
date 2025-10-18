import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utills/token";
import { HttpStatus } from "../constants/httpstatus";

const whitelist = [
  "/api/1.0/auth/login",
  "/api/1.0/register"
];

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.path)
  // ✅ Если маршрут в whitelist — пропускаем без проверки
  if (whitelist.includes(req.path) || (process.env.DEBUG == 'true' && req.headers.no_auth == 'true')) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }

  // @ts-ignore
  req.userinfo = decoded;
  next();
}

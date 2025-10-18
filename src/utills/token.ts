import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "ACCESS_SECRET";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "REFRESH_SECRET";

export function generateAccessToken(payload: object) {
  return jwt.sign(payload, secret, { expiresIn: "15m" });
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, refreshSecret);
  } catch {
    return null;
  }
}

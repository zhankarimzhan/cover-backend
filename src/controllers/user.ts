import { HttpStatus } from "../constants/httpstatus";
import { getUserDB, registerDB } from "../db_apis/user";
import log from "../logger/logger";

import { NextFunction, Request, Response } from "express";
import { createBind } from "../utills/bind";

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import getClient from "../db_apis/db";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utills/token";

export async function registerController(req: Request, res: Response, next: NextFunction) {
  let client;
  try {
    client = getClient();
    await client.connect();

    // 1. Собираем все параметры запроса
    const bind = createBind(req);
    if(!bind.username){
      throw {
        status : HttpStatus.BAD_REQUEST,
        message : "username is required sosal?"
      }
    }
    // 2. Генерируем UUID
    const userUuid = uuidv4();

    // 3. Хэшируем пароль (можно менять saltRounds, например 10)
    const hashedPassword = await bcrypt.hash(bind.password, 10);

    // 4. Отправляем данные в БД
    const data = await registerDB(
      {
        username: bind.username,
        password: hashedPassword,
        uuid: userUuid,
      },
      client
    );

     res.status(HttpStatus.CREATED).json({
      message: "User registered successfully",
      data,
    });
    next()
  } catch (error) {
    log.error(error);
    next(error); // Передаём в errorMiddleware
  } finally {
    if (client) {
      await client.end();
    }
  }
}

export async function authController(req: Request, res: Response, next: NextFunction) {
  let client;
  try {
    client = getClient();
    await client.connect();

    const bind = createBind(req); // username, password

    // 1. Найти пользователя по username
    const userdata: any = await getUserDB({ username: bind.username }, client);

    if (!userdata) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "User not found" });
    }

    // 2. Проверить пароль через bcrypt.compare
    const isPasswordValid = await bcrypt.compare(bind.password, userdata.password);
    if (!isPasswordValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid password" });
    }

    // 3. Генерируем токен
    const token = generateAccessToken({
      user_id: userdata.id,
      user_uuid: userdata.uuid,
      username: userdata.username,
    });
    const refreshToken = generateRefreshToken({
      user_id: userdata.id,
      user_uuid: userdata.uuid,
      username: userdata.username
    });

    // 4. Ответ
    return res.status(HttpStatus.OK).json({
      message: "Login successful",
      user: {
        id: userdata.id,
        uuid: userdata.uuid,
        username: userdata.username,
        token: token,
        refresh : refreshToken
      },
    });

  } catch (error) {
    next(error);
  } finally {
    if (client) await client.end();
  }
}

export async function refreshController(req: Request, res:Response, next: NextFunction) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Refresh token missing" });
  }

  const decoded: any = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: "Invalid refresh token" });
  }

  // Создаём новый Access Token
  const newAccessToken = generateAccessToken({
    id: decoded.id,
    uuid: decoded.uuid,
    username: decoded.username
  });

  return res.json({ accessToken: newAccessToken });
}
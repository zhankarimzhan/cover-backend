import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      userinfo?: any; // или конкретный тип пользователя
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export {};

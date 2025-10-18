
declare global {
  namespace Express {
    interface Request {
      userinfo?: any; // или конкретный тип пользователя
    }
  }
}

export {};

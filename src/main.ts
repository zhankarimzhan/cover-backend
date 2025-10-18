import express, { Request, Response } from 'express';
import router from './router';
import dotenv from "dotenv";
import { httpLogger } from './middlware/loggermidleware';
import { errorMiddleware } from './middlware/errormiddleware';
import { authMiddleware } from './middlware/authmiddleware';
dotenv.config(); // Загружаем .env

const app = express();
const port = process.env.PORT||8080;
app.use(express.json());

app.use(httpLogger)
app.use(authMiddleware)
app.use("/api/1.0",router)
// Запуск сервера
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

import express from 'express';
import router from './router';
import dotenv from "dotenv";
import { httpLogger } from './middlware/loggermidleware';
import { errorMiddleware } from './middlware/errormiddleware';
import { authMiddleware } from './middlware/authmiddleware';
import { createServer } from 'http';
import { initSocket } from './socket';
import { upload } from './middlware/uploadmiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
app.use(upload.single("file"));  

app.use(express.json());
app.use(httpLogger);
app.use(authMiddleware);
app.use("/api/1.0", router);
app.use(errorMiddleware);


const httpServer = createServer(app);
const io = initSocket(httpServer);

// ✅ Сохраняем io в app (важно!)
app.set("io", io);

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

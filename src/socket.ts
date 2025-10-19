import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

export function initSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

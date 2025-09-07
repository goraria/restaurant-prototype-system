import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Thay đổi theo URL của frontend
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Message received:", data);
    // Phát lại tin nhắn cho tất cả người dùng khác
    socket.broadcast.emit("message", data);

    socket.send("message", (data: any) => {
      io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
    });

    // Hoặc gửi lại cho chính người gửi
    socket.emit("message", data);

    socket.on("typing", (isTyping) => {
      socket.broadcast.emit("typing", { userId: socket.id, isTyping });
    });

    socket.on("statusChange", (status) => {
      socket.broadcast.emit("statusChange", { userId: socket.id, status });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socket.broadcast.emit("statusChange", { userId: socket.id, status: "offline" });
    });

    socket.on("privateMessage", ({ to, message }) => {
      io.to(to).emit("privateMessage", { from: socket.id, message });
    });

    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`${socket.id} left room: ${room}`);
    });

    socket.on("roomMessage", ({ room, message }) => {
      io.to(room).emit("roomMessage", { from: socket.id, message });
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("Socket.IO server running at http://localhost:4000/");
});
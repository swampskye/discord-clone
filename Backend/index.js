import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import serverRoutes from "./routes/server.js";
import messageRoutes from "./routes/message.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // 或你的前端地址
    methods: ["GET", "POST"],
  },
});

// 中间件
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  req.io = io;
  next();
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/server", serverRoutes);
app.use("/api/channel", messageRoutes);

io.on("connection", (socket) => {
  console.log("用户连接:", socket.id);
  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
    console.log(`用户加入频道: ${channelId}`);
  });

  socket.on("disconnect", () => {
    console.log("用户断开连接");
  });
});

// 连接 MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB 连接成功"))
  .catch((err) => console.error("MongoDB 连接失败:", err));

const PORT = process.env.PORT || 5555;
server.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));

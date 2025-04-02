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

const textChatNamespace = io.of("/text");
const voiceChatNamespace = io.of("/voice");

app.use((req, res, next) => {
  req.io = io;
  req.textChatNamespace = textChatNamespace;
  req.voiceChatNamespace = voiceChatNamespace;
  next();
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/server", serverRoutes);
app.use("/api/channel", messageRoutes);

// socket.io namespace
textChatNamespace.on("connection", (socket) => {
  // console.log("用户连接:", socket.id);
  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
    // console.log(`用户加入频道: ${channelId}`);
  });

  socket.on("disconnect", () => {
    console.log("用户断开连接");
  });
});

voiceChatNamespace.on("connection", (socket) => {
  console.log(`🟢 语音聊天连接: ${socket.id}`);

  socket.on("joinVoiceChannel", ({ channelId, userId }) => {
    // console.log(channelId);
    // console.log(userId);
    socket.join(channelId);
    console.log(`用户 ${userId} 加入语音频道: ${channelId}`);
    voiceChatNamespace.to(channelId).emit("userJoined", userId);
  });

  socket.on("leaveVoiceChannel", ({ channelId, userId }) => {
    socket.leave(channelId);
    console.log(`用户 ${userId} 离开语音频道: ${channelId}`);
    voiceChatNamespace.to(channelId).emit("userLeft", userId);
  });

  // WebRTC 信令
  socket.on("offer", (data) => {
    // console.log("received offer");
    console.log(data.channelId);
    socket.to(data.channelId).emit("offer", data.offer);
    // socket.emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    console.log("received answer");
    console.log(data.channelId);
    socket.to(data.channelId).emit("answer", data.answer);
  });

  socket.on("ice-candidate", (data) => {
    console.log("ice-candidate");
    socket.to(data.channelId).emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log(`🛑 语音聊天断开: ${socket.id}`);
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

const leaveVoiceChannel = async () => {
  const channel = await Channel.findById(channelId);
  if (!channel) return res.status(404).json({ message: "频道未找到" });

  if (channel.type !== "voice") {
    return res.status(400).json({ message: "此频道不是语音频道" });
  }

  channel.participants = channel.participants?.filter(
    (id) => id.toString() !== userId
  );
  await channel.save();
};

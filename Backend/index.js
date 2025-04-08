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
    origin: "http://localhost:5173",
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

// text chat socket namespace
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

// webrtc signal socket namespace
const users = {};
const socketToRoom = {};
const MaxUserNumber = 10;
voiceChatNamespace.on("connection", (socket) => {
  console.log(`🟢 语音聊天连接: ${socket.id}`);

  socket.on("join room", (channelId) => {
    // socket.join(channelId);
    if (users[channelId]) {
      const length = users[channelId].length;
      if (length === MaxUserNumber) {
        socket.emit("room full");
        return;
      }
      users[channelId].push(socket.id);
    } else {
      users[channelId] = [socket.id];
    }
    // console.log(users);
    socketToRoom[socket.id] = channelId;
    const usersInThisRoom = users[channelId].filter((id) => id !== socket.id);
    // const usersInThisRoom = users[channelId];
    console.log("usersInThisRoom", usersInThisRoom);
    socket.emit("all users", usersInThisRoom);
    // voiceChatNamespace.to(channelId).emit("all users", usersInThisRoom);

    // voiceChatNamespace.emit("all users", usersInThisRoom);
  });

  // socket.on("leaveVoiceChannel", ({ channelId, userId }) => {
  //   socket.leave(channelId);
  //   console.log(`用户 ${userId} 离开语音频道: ${channelId}`);
  //   voiceChatNamespace.to(channelId).emit("userLeft", userId);
  // });

  socket.on("offer", (payload) => {
    console.log("payload in offer", payload.userToSignal);
    voiceChatNamespace.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("answer", (payload) => {
    console.log("payload in answer");
    voiceChatNamespace.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const channelId = socketToRoom[socket.id];
    let room = users[channelId];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[channelId] = room;
    }
    socket.broadcast.emit("user left", socket.id);
  });

  socket.on("change", (payload) => {
    socket.broadcast.emit("change", payload);
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

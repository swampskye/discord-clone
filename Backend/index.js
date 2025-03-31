import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import serverRoutes from "./routes/server.js";
dotenv.config();
const app = express();

// 中间件
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/server", serverRoutes);

// 连接 MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB 连接成功"))
  .catch((err) => console.error("MongoDB 连接失败:", err));

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));

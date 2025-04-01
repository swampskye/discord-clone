import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Channel from "../models/Channel.js";
import Server from "../models/Server.js";

const router = express.Router();

// 创建频道
router.post("/:serverId/createChannel", authMiddleware, async (req, res) => {
  const { name, type, userId } = req.body;
  const { serverId } = req.params;
  // console.log(name);
  // console.log(type);
  // console.log(serverId);

  if (!name) {
    return res.status(400).json({ message: "频道名称不能为空" });
  }

  try {
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: "服务器未找到" });
    }
    if (server.owner.toString() !== userId) {
      return res.status(403).json({ message: "只有服务器所有者可以创建频道" });
    }

    const existingChannel = await Channel.findOne({ name, server: serverId });
    if (existingChannel) {
      return res.status(500).json({ message: "该频道名称已被使用" });
    }

    const newChannel = new Channel({ name, type, server: serverId });
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (error) {
    // console.log(error);
    if (error.code === 11000) {
      // MongoDB 唯一索引冲突错误
      return res.status(400).json({ message: "该频道名称已存在" });
    }
    res.status(500).json({ message: "服务器错误" });
  }
});

// 2️⃣ 获取服务器的所有频道
router.get("/:serverId/channels", authMiddleware, async (req, res) => {
  const { serverId } = req.params;

  try {
    const channels = await Channel.find({ server: serverId });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

export default router;

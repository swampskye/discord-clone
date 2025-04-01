import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 获取指定频道的消息
router.get("/:channelId/messages", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ channel: req.params.channelId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "获取消息失败" });
  }
});

// 发送消息
router.post("/:channelId/sendMessage", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const { channelId } = req.params;
  const userId = req.user?.userId;

  // console.log(content);
  // console.log(channelId);
  // console.log(userId);

  if (!content) return res.status(400).json({ message: "消息不能为空" });

  try {
    const user = await User.findById(userId);
    const newMessage = new Message({
      content,
      sender: userId,
      channel: channelId,
    });
    newMessage.sender = user;
    await newMessage.save();
    // 通过 WebSocket 广播新消息
    req.io.to(channelId).emit("newMessage", newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "发送失败" });
  }
});

export default router;

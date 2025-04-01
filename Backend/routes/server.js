import express from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import Server from "../models/Server.js";
import authMiddleware from "../middleware/authMiddleware.js";
import channelRoutes from "./channel.js";

const router = express.Router();

// 配置 multer 用于处理头像上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 保证文件名唯一
  },
});

const upload = multer({ storage });

// 创建服务器
// router.post(
//   "/createServer",
//   authMiddleware,
//   upload.single("avatar"),
//   async (req, res) => {
//     try {
//       console.log("createServer is called");
//       const { name } = req.body;
//       const avatarUrl = req.file ? `/uploads/${req.file.filename}` : "";

//       const newServer = new Server({
//         name,
//         avatarUrl,
//         owner: req.user.userId,
//       });

//       await newServer.save();
//       res.status(201).json({ message: "服务器创建成功", server: newServer });
//     } catch (error) {
//       res.status(500).json({ message: "服务器创建失败" });
//     }
//   }
// );

// 不上传头像
router.post(
  "/createServer",
  authMiddleware,
  // upload.single("avatar"),
  async (req, res) => {
    try {
      const { name } = req.body;
      const newServer = new Server({
        name,
        avatarUrl: "defaultAvatarUrl",
        owner: req.user.userId,
        members: [req.user.userId],
      });
      await newServer.save();
      res.status(201).json({ message: "服务器创建成功", server: newServer });
    } catch (error) {
      res.status(500).json({ message: "服务器创建失败" + error });
    }
  }
);

// 查询用户所属的所有服务器
router.get("/servers", authMiddleware, async (req, res) => {
  try {
    // 根据当前用户的 userId 查找他们所属的服务器
    // console.log("userid", req.user.userId);
    const userServers = await Server.find({
      members: req.user.userId,
    }).populate("members", "username email");
    // console.log(userServers);
    res.json(userServers);
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

router.get("/:serverId/users", authMiddleware, async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId).populate({
      path: "members",
      select: "-passwordHash",
    });

    if (!server) {
      return res.status(404).json({ message: "服务器未找到" });
    }

    res.json({ users: server.members });
  } catch (error) {
    console.error("获取服务器成员失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 生成新的邀请链接
router.post("/:serverId/generate-invite", async (req, res) => {
  try {
    const { serverId } = req.params;
    const inviteCode = nanoid(10); // 生成 10 位唯一邀请码

    const server = await Server.findByIdAndUpdate(
      serverId,
      { inviteCode },
      { new: true }
    );
    if (!server) {
      return res.status(404).json({ message: "服务器未找到" });
    }

    res.json({ inviteCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 通过邀请码加入服务器
router.post("/join/:inviteCode", async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const { userId } = req.body;
    // console.log(inviteCode);
    // console.log(userId);

    const server = await Server.findOne({ inviteCode });
    if (!server) {
      return res.status(404).json({ message: "邀请码无效" });
    }

    if (server.members.includes(userId)) {
      return res.status(400).json({ message: "你已经在该服务器中" });
    }

    server.members.push(userId);
    await server.save();

    res.json({ message: "加入成功", server });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

router.use(channelRoutes);

export default router;

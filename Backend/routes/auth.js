import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 用户注册
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "用户已存在" });

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 创建用户
    const newUser = new User({ username, email, passwordHash });
    await newUser.save();

    res.status(201).json({ message: "用户注册成功" });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "用户不存在" });

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "密码错误" });

    // 生成 JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 发送 token
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.json({
      message: "登录成功",
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  // console.log(req.cookies);
  const token = req.cookies.token;
  // console.log("authMiddleware");
  const user = await User.findById(req.user.userId).select("-passwordHash");
  res.json(user);
});

export default router;

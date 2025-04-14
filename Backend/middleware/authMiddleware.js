import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token);
  // console.log("authMiddleware");

  if (!token) return res.status(401).json({ message: "未授权访问" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "无效 Token" });
  }
};

export default authMiddleware;

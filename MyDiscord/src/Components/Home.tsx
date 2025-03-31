// import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5555/api/auth/me", { withCredentials: true }) // 发送请求检查用户状态
      .then(() => {
        navigate("/home"); // 已登录，跳转到 /home
        console.log("home");
      })
      .catch(() => {
        navigate("/sign"); // 未登录，跳转到 /login
        console.log("sign");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return loading ? <div>Loading...</div> : null; // 防止闪烁
};

export default Home;

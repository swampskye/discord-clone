// import "./App.css";
import { useRoutes, useNavigate } from "react-router-dom";
import routes from "./routes";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const outlet = useRoutes(routes);
  const navigate = useNavigate();

  useEffect(() => {
    // 在页面加载时检查用户登录状态
    axios
      .get("http://localhost:5555/api/auth/me", { withCredentials: true }) // 检查用户是否登录
      .then(() => {
        // 用户已登录，不需要跳转
        console.log("User is logged in");
      })
      .catch(() => {
        // 用户未登录，跳转到登录页面
        console.log("User is not logged in");
        navigate("/"); // 跳转至 /login
      });
  }, [navigate]);

  return outlet;
}

export default App;

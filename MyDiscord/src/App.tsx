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
      .then((res) => {
        localStorage.setItem("userId", res.data._id);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  return outlet;
}

export default App;

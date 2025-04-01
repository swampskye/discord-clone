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
        // console.log("User is logged in");
      })
      .catch(() => {
        // console.log("User is not logged in");
        navigate("/");
      });
  }, [navigate]);

  return outlet;
}

export default App;

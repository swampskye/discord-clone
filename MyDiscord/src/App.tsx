// import "./App.css";
import { useRoutes, useNavigate } from "react-router-dom";
import routes from "./routes";
import axios from "axios";
import { useEffect } from "react";
import request from "./utils/request";

function App() {
  const outlet = useRoutes(routes);
  const navigate = useNavigate();

  // useEffect(() => {
  //   // 在页面加载时检查用户登录状态
  //   request
  //     .get("/auth/me", { withCredentials: true }) // 检查用户是否登录
  //     .then((res) => {
  //       localStorage.setItem("userId", res.data._id);
  //     })
  //     .catch(() => {
  //       // console.log(import.meta.env.VITE_API_BASE_URL);
  //       // navigate("/");
  //     });
  // }, [navigate]);

  return outlet;
}

export default App;

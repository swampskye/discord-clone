import { useState } from "react";
import Register from "../../Components/Register";
import Login from "../../Components/Login";

import "./sign.css";

const Sign = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toogleButton = () => {
    setIsLogin(!isLogin);
  };
  return (
    <div className="container">
      <div className="pannel">
        <div>{isLogin ? <Login /> : <Register />}</div>
        <a onClick={toogleButton}>
          {isLogin ? <>Go to Register</> : <>Go to Login</>}
        </a>
      </div>
    </div>
  );
};

export default Sign;

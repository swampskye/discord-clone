import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res = await axios.post(
        "http://localhost:5555/api/auth/login",
        values,
        { withCredentials: true }
      );
      localStorage.setItem("token", res.data.token);
      message.success("Login Successfully");
      navigate("/home");
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      {contextHolder}
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Please text a valid e-mail",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please text your password" }]}
      >
        <Input.Password />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        style={{ display: "block", margin: "0 auto" }}
      >
        Login
      </Button>
    </Form>
  );
};

export default Login;

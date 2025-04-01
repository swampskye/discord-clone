import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await axios.post(
        "http://localhost:5555/api/auth/register",
        values
      );
      message.success(res.data.message);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      {contextHolder}
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: "Please text username" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Pleas text a valid e-mail",
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
        SignUp
      </Button>
    </Form>
  );
};

export default Register;

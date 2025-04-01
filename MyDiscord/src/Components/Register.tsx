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
      messageApi.error(error.response?.data?.message || "注册失败");
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      {contextHolder}
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="邮箱"
        name="email"
        rules={[{ required: true, type: "email", message: "请输入有效的邮箱" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input.Password />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        style={{ display: "block", margin: "0 auto" }}
      >
        注册
      </Button>
    </Form>
  );
};

export default Register;

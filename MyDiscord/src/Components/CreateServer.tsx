import { Form, Input, Button, message } from "antd";
import axios from "axios";

const CreateServer = () => {
  const onCreate = (path: string) => {
    window.location.href = path;
  };

  const onFinish = async (values: { name: string }) => {
    try {
      const res = await axios.post(
        "http://localhost:5555/api/server/createServer",
        { name: values.name },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      message.success("服务器创建成功");
      const path = `/home/server/${res.data.server._id}`;
      onCreate(path);
    } catch (error: any) {
      message.error(error.response?.data?.message || "服务器创建失败");
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="服务器名称"
        name="name"
        rules={[{ required: true, message: "请输入服务器名称" }]}
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        创建服务器
      </Button>
    </Form>
  );
};

export default CreateServer;

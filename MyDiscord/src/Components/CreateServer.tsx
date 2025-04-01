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
      message.success("Server Created");
      const path = `/home/server/${res.data.server._id}`;
      onCreate(path);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Some Errors happend");
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Server Name"
        name="name"
        rules={[{ required: true, message: "Please text Server Name" }]}
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Create A Server
      </Button>
    </Form>
  );
};

export default CreateServer;

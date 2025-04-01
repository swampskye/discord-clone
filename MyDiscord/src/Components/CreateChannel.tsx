import { Form, Input, Button, Select, message } from "antd";

import axios from "axios";
import { useParams } from "react-router-dom";

const CreateChannel = () => {
  const [messageApi, messageContext] = message.useMessage();
  const { serverId } = useParams();
  const onCreate = (path: string) => {
    window.location.href = path;
  };

  const onFinish = async (values: { name: string; type: string }) => {
    try {
      const res = await axios.post(
        `http://localhost:5555/api/server/${serverId}/createChannel`,
        {
          name: values.name,
          type: values.type,
          userId: localStorage.getItem("userId"),
          serverId: serverId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      messageApi.success("Channel Created");
      const path = `/home/server/${res.data.server}/channel/${res.data._id}`;
      onCreate(path);
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || "Some Errors happend");
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      {messageContext}
      <Form.Item
        label="Channel Name"
        name="name"
        rules={[{ required: true, message: "Please Text a Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="type" label="Channel Type">
        <Select defaultValue="text">
          <Select.Option value="text">Text Channel</Select.Option>
          <Select.Option value="voice">Voice&Video Channel</Select.Option>
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Create A Channel
      </Button>
    </Form>
  );
};

export default CreateChannel;

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
          serverId: serverId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      messageApi.success("频道创建成功");
      const path = `/home/server/${res.data.server}/channel/${res.data._id}`;
      onCreate(path);
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || "频道创建失败");
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      {messageContext}
      <Form.Item
        label="频道名称"
        name="name"
        rules={[{ required: true, message: "请输入频道名称" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="type" label="频道类型">
        <Select defaultValue="text">
          <Select.Option value="text">文本频道</Select.Option>
          <Select.Option value="voice">语音频道</Select.Option>
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        创建频道
      </Button>
    </Form>
  );
};

export default CreateChannel;

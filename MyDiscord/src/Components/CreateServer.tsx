import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";

// interface CreateServerProps {
//   onCreate: () => void;
// }
// { onCreate }: CreateServerProps
const CreateServer = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const onCreate = () => {
    window.location.href = "/home";
  };

  // const onFinish = async (values: { name: string }) => {
  //   const formData = new FormData();
  //   formData.append("name", values.name);
  //   if (fileList.length > 0) {
  //     formData.append("avatar", fileList[0].originFileObj);
  //   }

  //   try {
  //     await axios.post(
  //       "http://localhost:5555/api/server/createServer",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     message.success("服务器创建成功");
  //     onCreate(); // 回调刷新页面
  //   } catch (error: any) {
  //     message.error(error.response?.data?.message || "服务器创建失败");
  //   }
  // };
  const onFinish = async (values: { name: string }) => {
    try {
      await axios.post(
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
      onCreate(); // 回调刷新页面
    } catch (error: any) {
      message.error(error.response?.data?.message || "服务器创建失败");
    }
  };

  // const handleUploadChange = (info: any) => {
  //   setFileList(info.fileList);
  // };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="服务器名称"
        name="name"
        rules={[{ required: true, message: "请输入服务器名称" }]}
      >
        <Input />
      </Form.Item>
      {/* <Form.Item label="服务器头像" valuePropName="fileList">
        <Upload
          listType="picture"
          onChange={handleUploadChange}
          beforeUpload={() => false} // 不自动上传
          fileList={fileList}
        >
          <Button icon={<UploadOutlined />}>上传头像</Button>
        </Upload>
      </Form.Item> */}
      <Button type="primary" htmlType="submit">
        创建服务器
      </Button>
    </Form>
  );
};

export default CreateServer;

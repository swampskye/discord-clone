import { useState } from "react";
import { Input, Button } from "antd";
import axios from "axios";

const SendMessage = ({ channelId }: { channelId: string }) => {
  const [content, setContent] = useState("");

  const sendMessage = async () => {
    if (!content.trim()) return;
    await axios.post(
      `http://localhost:5555/api/channel/${channelId}/sendMessage`,
      { content },
      { withCredentials: true }
    );
    setContent("");
    // scrollToBottom();
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="输入消息..."
      />
      <Button type="primary" size="large" onClick={sendMessage}>
        发送
      </Button>
    </div>
  );
};

export default SendMessage;

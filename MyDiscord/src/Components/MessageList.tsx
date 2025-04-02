import { useEffect, useState } from "react";
import { List, Avatar } from "antd";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5555/text");

interface Message {
  _id: string;
  content: string;
  sender: { username: string; _id: string };
  createdAt: string;
}

const MessageList = ({
  channelId,
  scrollToBottom,
}: {
  channelId: string;
  scrollToBottom: Function;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 连接 WebSocket 频道
    socket.emit("joinChannel", channelId);

    // 获取历史消息
    axios
      .get(`http://localhost:5555/api/channel/${channelId}/messages`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data));

    // 监听新消息
    socket.on("newMessage", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [channelId, socket]);

  return (
    <List
      dataSource={messages}
      renderItem={(msg) => {
        return (
          <List.Item>
            <List.Item.Meta
              // avatar={<Avatar>{msg.sender.username[0].toUpperCase()}</Avatar>}
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${msg.sender._id}`}
                />
              }
              title={msg.sender.username}
              description={msg.content}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default MessageList;

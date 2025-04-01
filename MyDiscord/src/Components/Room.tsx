import { useParams } from "react-router-dom";
import MessageList from "./MessageList";
import SendMessage from "./SendMessage";
import { useRef } from "react";

const Room = () => {
  const { channelId } = useParams();
  const messageListRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Channel-{channelId}</h2>
      <div
        ref={messageListRef}
        style={{
          overflowY: "auto",
          height: "80vh",
          border: "2px solid #aaa",
          borderRadius: "10px",
          padding: "10px",
          boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <MessageList
          channelId={channelId || "defaultChannelId"}
          scrollToBottom={scrollToBottom}
        />
      </div>
      <div style={{ margin: "20px" }}>
        <SendMessage channelId={channelId || "defaultChannelId"} />
      </div>
    </div>
  );
};

export default Room;

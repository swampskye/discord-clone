import { useParams } from "react-router-dom";
import MessageList from "./MessageList";
import SendMessage from "./SendMessage";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import VoiceChat from "./VoiceChat";

const Room = () => {
  const { channelId } = useParams();
  const [channelType, setChannelType] = useState("text");
  const messageListRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const checkVoiceRoom = async () => {
      const res = await axios.get(
        `http://localhost:5555/api/server/channel/${channelId}`,
        {
          withCredentials: true,
        }
      );
      const type = res.data.type;
      setChannelType(type);
    };
    checkVoiceRoom();
  }, [channelId]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      {/* Voice Chat Component */}
      {channelType === "voice" ? (
        <VoiceChat channelId={channelId} />
      ) : (
        <h1>Text Channel</h1>
      )}
      <h2 style={{ textAlign: "center" }}>Channel-{channelId}</h2>
      {/* Text Chat Component */}
      {/* <div>
        <div
          ref={messageListRef}
          style={{
            overflowY: "auto",
            height: "60vh",
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
      </div> */}
    </div>
  );
};

export default Room;

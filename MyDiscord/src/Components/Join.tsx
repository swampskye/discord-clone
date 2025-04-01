import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const Join = () => {
  const { inviteCode } = useParams();
  const [joined, setJoined] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    const joinServer = async () => {
      try {
        const res = await axios.post(
          `http://localhost:5555/api/server/join/${inviteCode}`,
          {
            userId: localStorage.getItem("userId"),
          },
          { withCredentials: true }
        );
        message.success("Successfully Join the Server");
        setJoined(true);
        const serverId = res.data.server._id;
        navigateTo(`/home/server/${serverId}`);
      } catch (err: any) {
        message.error(err.response?.data?.message || "Join failed");
        navigateTo(`/home/server`);
      }
    };

    if (inviteCode) {
      joinServer();
    }
  }, [inviteCode]);

  return (
    <div>
      {joined ? (
        <p>You are already in the server</p>
      ) : (
        <p>Join the server...</p>
      )}
    </div>
  );
};

export default Join;

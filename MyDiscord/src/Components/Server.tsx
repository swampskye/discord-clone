import { Button, Card, Input, message } from "antd";
import { useState } from "react";
import { useLocation, useOutlet, useParams } from "react-router-dom";
import axios from "axios";

const Server = () => {
  const outlet = useOutlet();

  const { serverId } = useParams();
  const { channelId } = useParams();
  const path = useLocation();
  // console.log(channelId);

  const [messageApi, messageContext] = message.useMessage();
  const [inviteCode, setInviteCode] = useState("");
  const generateInvite = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5555/api/server/${serverId}/generate-invite`
      );
      setInviteCode(res.data.inviteCode);
      messageApi.success("邀请码已生成");
    } catch (err) {
      messageApi.error("生成邀请码失败");
    }
  };
  if (channelId || path.pathname.includes("createChannel")) {
    return outlet;
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {messageContext}
        <Card
          title="Server Info"
          variant="outlined"
          hoverable={true}
          style={{ width: "40vw" }}
        >
          <h1>Server ID: {serverId}</h1>
          <Button type="primary" onClick={generateInvite}>
            Generate Invite Code
          </Button>
          {inviteCode && (
            <h1>
              <Input
                value={`http://localhost:5173/join/${inviteCode}`}
                readOnly
              />
            </h1>
          )}
        </Card>
      </div>
    );
  }
};

export default Server;

import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Menu, MenuProps, Button, message, List, Avatar } from "antd";
import {
  TeamOutlined,
  CloudServerOutlined,
  AudioOutlined,
  FontSizeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import MenuItem from "antd/es/menu/MenuItem";
import axios from "axios";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const DiscordLayout: React.FC = () => {
  const [messageApi, messageContext] = message.useMessage();
  const [serverItems, setServerItems] = useState<MenuItem[]>([]);
  const [channelItems, setChannelItems] = useState<MenuItem[]>([]);
  const [usersInServer, setUsersInServer] = useState([]);

  const navigateTo = useNavigate();
  const { serverId } = useParams();
  const { channelId } = useParams();

  const serverMenuClick = (e: { key: string }) => {
    navigateTo(e.key);
  };
  const channelMenuClick = (e: { key: string }) => {
    navigateTo(e.key);
  };
  const location = useLocation();
  const goToCreateChannel = () => {
    if (serverId) {
      navigateTo(`/home/server/${serverId}/createChannel`);
    } else {
      messageApi.error("Please Choose a Server");
    }
  };

  // fetch server list by user
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const data = await axios.get(
          "http://localhost:5555/api/server/servers",
          // search by userId
          { withCredentials: true }
        );
        // console.log(data.data);
        const res = data.data;
        const items: any[] = [];
        res.map((element: any) => {
          items.push(
            getItem(
              `${element.name}`,
              `server/${element._id}`,
              <CloudServerOutlined />
            )
          );
        });
        // console.log(items);
        setServerItems(items);
      } catch (error) {
        // console.error(error);
      }
    };
    fetchServers();
  }, [location.pathname]);

  // fetch channel list by server
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const data = await axios.get(
          `http://localhost:5555/api/server/${serverId}/channels`,
          { withCredentials: true }
        );
        // console.log(data.data);
        const res = data.data;
        const items: any[] = [];
        res.map((element: any) => {
          items.push(
            getItem(
              `${element.name}`,
              `server/${serverId}/channel/${element._id}`,
              element.type === "text" ? <FontSizeOutlined /> : <AudioOutlined />
            )
          );
        });
        // console.log(items);
        setChannelItems(items);
      } catch (error) {
        // console.error(error);
      }
    };
    if (serverId) fetchChannels();
  }, [serverId]);

  // fetch users in current server
  useEffect(() => {
    const fetchUsersFromServer = async () => {
      try {
        const res: any = await axios.get(
          `http://localhost:5555/api/server/${serverId}/users`,
          {
            withCredentials: true,
          }
        );
        setUsersInServer(res.data.users);
      } catch (err: any) {
        messageApi.error("err happened");
      }
    };
    if (serverId) fetchUsersFromServer();
  }, [serverId]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f2f5" }}>
      {/* 服务器列表 */}
      {messageContext}
      <div
        style={{
          width: 150,
          background: "#1e1f22",
          display: "flex",
          flexDirection: "column",
          borderRight: "2px solid #555",
        }}
      >
        <Button
          style={{ backgroundColor: "#95a8e2" }}
          onClick={() => navigateTo("/home/createServer")}
        >
          <PlusCircleOutlined />
          Create A Server
        </Button>
        <Menu
          mode="vertical"
          theme="dark"
          style={{ height: "100%", borderRight: 0 }}
          items={serverItems}
          onClick={serverMenuClick}
          selectedKeys={[`server/${serverId}`]}
        ></Menu>
      </div>
      {/* 频道列表 */}
      <div
        style={{
          width: 150,
          background: "#2f3136",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          style={{ backgroundColor: "#95a8e2" }}
          onClick={goToCreateChannel}
        >
          <PlusCircleOutlined />
          Create A Channel
        </Button>
        <Menu
          mode="inline"
          theme="dark"
          style={{ height: "100%", borderRight: 0 }}
          items={channelItems}
          onClick={channelMenuClick}
          selectedKeys={[`server/${serverId}/channel/${channelId}`]}
        ></Menu>
      </div>
      {/* 聊天窗口（根据路由动态显示内容） */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          padding: "16px",
        }}
      >
        <Outlet />
      </div>
      {/* Server用户列表 */}
      {serverId && (
        <div
          style={{
            width: 250,
            background: "#2f3136",
            display: "flex",
            flexDirection: "column",
            marginLeft: "auto",
          }}
        >
          <Menu
            mode="inline"
            theme="dark"
            style={{ height: "100%", borderLeft: 0 }}
          >
            <Menu.Item icon={<TeamOutlined />}>
              users in current server
            </Menu.Item>
            <List
              dataSource={usersInServer}
              renderItem={(user) => {
                return (
                  <List.Item onClick={() => console.log("haha")}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user._id}`}
                        />
                      }
                      title={
                        <span style={{ padding: "0 0px", color: "white" }}>
                          {user.username}
                        </span>
                      }
                      description={
                        <span style={{ padding: "0 0px", color: "white" }}>
                          {user.email}
                        </span>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Menu>
        </div>
      )}
    </div>
  );
};

export default DiscordLayout;

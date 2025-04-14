import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Menu, MenuProps, Button, message, List, Avatar, Card } from "antd";
import {
  TeamOutlined,
  CloudServerOutlined,
  AudioOutlined,
  FontSizeOutlined,
  PlusCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import MenuItem from "antd/es/menu/MenuItem";
import axios from "axios";
import request from "../utils/request";
import { Footer } from "antd/es/layout/layout";

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

  const logout = async () => {
    await request.post("/auth/logout", {}, { withCredentials: true });
    localStorage.clear();
    navigateTo("/");
  };
  useEffect(() => {
    // 在页面加载时检查用户登录状态
    request
      .get("/auth/me", { withCredentials: true }) // 检查用户是否登录
      .then((res) => {
        localStorage.setItem("userId", res.data._id);
      })
      .catch(() => {
        // console.log(import.meta.env.VITE_API_BASE_URL);
        // navigateTo("/");
      });
  }, [navigateTo]);

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
    <div style={{}}>
      <header
        style={{
          height: "5vh",
          background: "#1e1f22",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          color: "#fff",
        }}
      >
        {/* <Avatar size={48} src="/stitch.png" /> */}
        <div
          style={{
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src="/stitch.png"
            style={{ marginRight: "20px", height: "70px" }}
          />
          <h3 style={{ margin: 0, color: "#95a8e2" }}>MyDiscord</h3>
        </div>
        {/* user page */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            marginRight: "130px",
            gap: "10px",
          }}
        >
          {/* 这里放右上角用户信息 / 退出按钮 */}
          <span
            style={{ padding: "0 10px", color: "white", cursor: "pointer" }}
          >
            {localStorage.getItem("username")}
          </span>
          <Avatar
            style={{ cursor: "pointer" }}
            size={48}
            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${localStorage.getItem(
              "userId"
            )}`}
            onClick={() => {}}
          />
        </div>
        {/* logout */}
        <Button onClick={() => logout()}>
          <LogoutOutlined /> LogOut
        </Button>
      </header>
      <div style={{ display: "flex", height: "90vh", background: "#f0f2f5" }}>
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
            style={{
              height: "100%",
              borderRight: 0,
              backgroundColor: "#1e1f22",
            }}
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
            style={{
              height: "100%",
              borderRight: 0,
              backgroundColor: "#1e1f22",
            }}
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
              style={{
                height: "100%",
                borderLeft: 0,
                backgroundColor: "#1e1f22",
              }}
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
      <footer
        style={{
          textAlign: "center",
          backgroundColor: "#1e1f22",
          height: "4.8vh",
          borderTop: "solid 2px gray",
        }}
      >
        <h4 style={{ color: "white" }}>
          Ant Design ©{new Date().getFullYear()} Created by{" "}
          <a href="https://github.com/swampskye">Skye</a>
        </h4>
      </footer>
    </div>
  );
};

export default DiscordLayout;

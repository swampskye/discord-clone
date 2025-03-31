import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Menu, MenuProps, Button } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  EditOutlined,
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
// const ServerItems: MenuItem[] = [
//   getItem("Option 1", "server/serverId1", <PieChartOutlined />),
//   getItem("Option 2", "server/serverId2", <DesktopOutlined />),
// ];

const DiscordLayout: React.FC = () => {
  const [serverItems, setServerItems] = useState<MenuItem[]>([]);
  const [channelItems, setChannelItems] = useState<MenuItem[]>([]);
  // const [currentServer, setCurrentServer] = useState(
  //   serverItems[0]?.key?.toString()
  // );
  // const [currentChannel, setCurrentChannel] = useState(
  //   channelItems[0]?.key?.toString()
  // );

  const navigateTo = useNavigate();
  const { serverId } = useParams();
  const { channelId } = useParams();

  const serverMenuClick = (e: { key: string }) => {
    console.log("serverMenuClick");
    console.log(channelItems);
    navigateTo(e.key);
  };
  const channelMenuClick = (e: { key: string }) => {
    // console.log(e.key);
    console.log("channelMenuClick");
    navigateTo(e.key);
  };
  const location = useLocation();
  // fetch server list by user
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const data = await axios.get(
          "http://localhost:5555/api/server/servers",
          { withCredentials: true }
        );
        console.log(data.data);
        const res = data.data;
        const items: any[] = [];
        res.map((element: any) => {
          items.push(
            getItem("Option 1", `server/${element._id}`, <PieChartOutlined />)
          );
        });
        console.log(items);
        setServerItems(items);
      } catch (error) {
        console.error(error);
      }
      // setServerItems([
      //   getItem("Option 1", "server/serverId1", <PieChartOutlined />),
      //   getItem("Option 2", "server/serverId2", <DesktopOutlined />),
      // ]);
      // setCurrentServer(0);
    };
    fetchServers();
  }, [location.pathname]);

  useEffect(() => {
    // if (serverId === "serverId1") {
    //   setChannelItems([
    //     getItem(
    //       "Option 1",
    //       "server/serverId1/channel/channelId1",
    //       <PieChartOutlined />
    //     ),
    //     getItem(
    //       "Option 2",
    //       "server/serverId1/channel/channelId2",
    //       <DesktopOutlined />
    //     ),
    //   ]);
    // } else {
    //   setChannelItems([
    //     getItem(
    //       "Option 1",
    //       "server/serverId2/channel/channelId1",
    //       <PieChartOutlined />
    //     ),
    //     getItem(
    //       "Option 2",
    //       "server/serverId2/channel/channelId2",
    //       <DesktopOutlined />
    //     ),
    //   ]);
    // }
  }, [serverId]);
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f2f5" }}>
      {/* 服务器列表 */}
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
          style={{ margin: 3, backgroundColor: "#95a8e2" }}
          onClick={() => navigateTo("/home/createServer")}
        >
          <EditOutlined />
          Create A Server
        </Button>
        <Menu
          mode="vertical"
          theme="dark"
          style={{ height: "100%", borderRight: 0 }}
          items={serverItems}
          onClick={serverMenuClick}
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
        <Menu
          mode="inline"
          theme="dark"
          style={{ height: "100%", borderRight: 0 }}
          items={channelItems}
          onClick={channelMenuClick}
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

      {/* 在线用户列表 */}
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
          <Menu.Item icon={<TeamOutlined />}>在线用户</Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default DiscordLayout;

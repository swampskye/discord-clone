import Comp from "./Components/Comp";
import NotFound from "./Components/NotFound";
import DiscordLayout from "./Views/Layout";
import Room from "./Components/Room";
// import Home from "./Components/Home";
import Sign from "./Views/Sign/Sign";
import CreateServer from "./Components/CreateServer";
import CreateChannel from "./Components/CreateChannel";
import Server from "./Components/Server";
import Join from "./Components/Join";
import Welcome from "./Components/Welcome";

const routes = [
  {
    path: "/",
    element: <Sign />,
  },
  {
    path: "join/:inviteCode",
    element: <Join />,
  },
  {
    path: "/home",
    element: <DiscordLayout />,
    children: [
      { index: true, element: <Welcome /> },
      {
        path: "server/:serverId",
        element: <Server />,
        children: [
          {
            path: "channel/:channelId",
            element: <Room />,
          },
          {
            path: "createChannel",
            element: <CreateChannel />,
          },
        ],
      },
      {
        path: "createServer",
        element: <CreateServer />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
export default routes;

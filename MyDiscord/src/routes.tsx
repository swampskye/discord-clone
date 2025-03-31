import Comp from "./Components/Comp";
import NotFound from "./Components/NotFound";
import DiscordLayout from "./Views/Layout";
import Room from "./Components/Room";
// import Home from "./Components/Home";
import Sign from "./Views/Sign/Sign";
import CreateServer from "./Components/CreateServer";

const routes = [
  {
    path: "/",
    element: <Sign />,
  },
  {
    path: "/home",
    element: <DiscordLayout />,
    children: [
      {
        path: "server/:serverId",
        element: <Comp />,
        children: [
          {
            path: "channel/:channelId",
            element: <Room />,
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

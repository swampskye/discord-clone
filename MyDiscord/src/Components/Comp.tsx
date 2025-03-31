import { Outlet, useParams } from "react-router-dom";
import CreateChannel from "./CreateChannel";

const Comp = () => {
  const { channelId } = useParams();
  return <>{channelId ? <Outlet /> : <CreateChannel />}</>;
};

export default Comp;

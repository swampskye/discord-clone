import { Outlet, useParams } from "react-router-dom";

const Comp = () => {
  const { channelId } = useParams();
  return <>{channelId ? <Outlet /> : <h1>Choose a Channel</h1>}</>;
};

export default Comp;

import React from "react";

const Welcome = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // alignContent: "center",
        // justifyContent: "center",
      }}
    >
      <h1>Welcome to MyDiscord</h1>
      <img src="/stitch.png" width={500} />
    </div>
  );
};

export default Welcome;

import mongoose, { Schema } from "mongoose";

const serverSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    avatar: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 用户与服务器的关联
  },
  { timestamps: true }
);

const Server = mongoose.model("Server", serverSchema);

export default Server;

// import mongoose, { Schema, Document } from "mongoose";

// const channelSchema = new Schema(
//   {
//     name: { type: String, required: true, unique: true },
//     type: { type: String, enum: ["text", "voice"], default: "text" },
//     server: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Server",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const Channel = mongoose.model("Channel", channelSchema);
// export default Channel;

import mongoose, { Schema } from "mongoose";

const channelSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["text", "voice"], default: "text" },
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
      required: true,
    },
  },
  { timestamps: true }
);

// 创建复合唯一索引，确保同一个服务器内频道名称唯一
channelSchema.index({ name: 1, server: 1 }, { unique: true });

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;

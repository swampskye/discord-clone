import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis", // 👈 关键：构建期让 global 存在
    // "process.env.NODE_ENV": JSON.stringify(
    //   process.env.NODE_ENV || "development"
    // ),
  },
  optimizeDeps: {
    include: ["simple-peer"], // optional: 提前处理 simple-peer
  },
});

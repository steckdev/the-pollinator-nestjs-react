import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "",
  plugins: [react()],
  server: {
    open: true,
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:4001",
        changeOrigin: true,
        secure: false,
        ws: false,
      },
    },
  },
});

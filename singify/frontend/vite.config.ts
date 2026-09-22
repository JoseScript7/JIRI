import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Backend port — change this if you run the backend on a different port.
// Default: 4000. In development environments where 4000 is taken, set VITE_BACKEND_PORT.
const BACKEND_PORT = process.env.VITE_BACKEND_PORT ?? "4000";
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      // Proxy static asset folders served by the Express backend
      "/audio": {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      "/art": {
        target: BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
});

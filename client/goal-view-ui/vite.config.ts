import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import peggyPlugin from './vite-plugin-peggy';

// https://vitejs.dev/config/
export default defineConfig( ({mode}) => ({
  plugins: [react(), peggyPlugin()],
  build: {
    outDir: "build",
    sourcemap: mode === "development" ? "inline" : false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
}));

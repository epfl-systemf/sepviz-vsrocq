import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import peggyPlugin from './vite-plugin-peggy';

// https://vitejs.dev/config/
export default defineConfig( ({mode}) => ({
  plugins: [react(), peggyPlugin()],
  resolve: {
    dedupe: ['d3-transition', 'd3-selection', 'd3-graphviz', 'd3-ease', 'd3-timer', 'd3-interpolate', 'd3-color', 'd3-dispatch'],
  },
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

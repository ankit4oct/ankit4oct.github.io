import { readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = path.resolve(__dirname);

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    {
      name: "serve-source-shell",
      apply: "serve",
      transformIndexHtml: {
        order: "pre",
        handler() {
          return readFileSync(path.join(root, "index.template.html"), "utf8");
        },
      },
    },
  ],
  resolve: {
    alias: [
      {
        find: /^@designcodeio\/threeui\/style\.css$/,
        replacement: path.join(root, "src/shaders/threeui.css"),
      },
      {
        find: /^@designcodeio\/threeui$/,
        replacement: path.join(root, "src/shaders/landing-pages/LandingPages.tsx"),
      },
    ],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.join(root, "index.template.html"),
      },
    },
  },
});

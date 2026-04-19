import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "");
  const isBundle = mode === "bundle";

  return {
    plugins: [react(), ...(isBundle ? [viteSingleFile()] : [])],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: isBundle
      ? {
          outDir: "dist-artifact",
          emptyOutDir: true,
          assetsInlineLimit: 0,
          cssCodeSplit: false,
          rollupOptions: {
            output: { inlineDynamicImports: true },
          },
        }
      : undefined,
  };
});

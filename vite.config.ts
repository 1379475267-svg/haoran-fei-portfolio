import { defineConfig, type Plugin, type PreviewServer, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";

function projectPageRoutes(): Plugin {
  const install = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use((request, _response, next) => {
      const pageRequest = request as typeof request & { url?: string };
      const pathname = pageRequest.url?.split("?")[0];
      if (pathname === "/deadtime/" || pathname === "/docpilot/") {
        pageRequest.url = pageRequest.url?.replace(pathname, `${pathname}index.html`);
      }
      next();
    });
  };
  return { name: "project-page-routes", configureServer: install, configurePreviewServer: install };
}

export default defineConfig({
  base: "./",
  plugins: [react(), projectPageRoutes()],
  optimizeDeps: { entries: ["index.html"] },
});

// vite.config.ts
import typescript from "@rollup/plugin-typescript";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
var __vite_injected_original_dirname = "/Users/bryan/Projects/web/ally-ui/packages/common/react";
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "lib/main.ts"),
      name: "@ally-ui/react",
      fileName: "main"
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      plugins: [
        typescript({
          tsconfig: "./tsconfig.build.json"
        })
      ]
    }
  },
  plugins: [react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYnJ5YW4vUHJvamVjdHMvd2ViL2FsbHktdWkvcGFja2FnZXMvY29tbW9uL3JlYWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYnJ5YW4vUHJvamVjdHMvd2ViL2FsbHktdWkvcGFja2FnZXMvY29tbW9uL3JlYWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9icnlhbi9Qcm9qZWN0cy93ZWIvYWxseS11aS9wYWNrYWdlcy9jb21tb24vcmVhY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgdHlwZXNjcmlwdCBmcm9tICdAcm9sbHVwL3BsdWdpbi10eXBlc2NyaXB0JztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0YnVpbGQ6IHtcblx0XHRsaWI6IHtcblx0XHRcdGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ2xpYi9tYWluLnRzJyksXG5cdFx0XHRuYW1lOiAnQGFsbHktdWkvcmVhY3QnLFxuXHRcdFx0ZmlsZU5hbWU6ICdtYWluJyxcblx0XHR9LFxuXHRcdHJvbGx1cE9wdGlvbnM6IHtcblx0XHRcdGV4dGVybmFsOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuXHRcdFx0cGx1Z2luczogW1xuXHRcdFx0XHR0eXBlc2NyaXB0KHtcblx0XHRcdFx0XHR0c2NvbmZpZzogJy4vdHNjb25maWcuYnVpbGQuanNvbicsXG5cdFx0XHRcdH0pLFxuXHRcdFx0XSxcblx0XHR9LFxuXHR9LFxuXHRwbHVnaW5zOiBbcmVhY3QoKV0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVYsT0FBTyxnQkFBZ0I7QUFDOVcsT0FBTyxXQUFXO0FBQ2xCLFNBQVEsZUFBYztBQUN0QixTQUFRLG9CQUFtQjtBQUgzQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixPQUFPO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDSixPQUFPLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQ3ZDLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNYO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDZCxVQUFVLENBQUMsU0FBUyxXQUFXO0FBQUEsTUFDL0IsU0FBUztBQUFBLFFBQ1IsV0FBVztBQUFBLFVBQ1YsVUFBVTtBQUFBLFFBQ1gsQ0FBQztBQUFBLE1BQ0Y7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUNsQixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

import { defineConfig } from "vite";
import { cpSync } from "node:fs";

// Dynamic /images/... URLs are not imported into the JavaScript module, so
// the original images are copied into the deployment directory after build.
const copyImages = () => ({
  name: "copy-images",
  closeBundle() {
    cpSync(new URL("./images", import.meta.url), new URL("./dist/images", import.meta.url), { recursive: true });
  },
});

// The image plugin keeps static asset paths consistent in production builds.
export default defineConfig({ plugins: [copyImages()] });

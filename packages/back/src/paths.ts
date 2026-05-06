import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "../../../");

export const paths = {
    projectRoot,
    serverDir: path.join(projectRoot, "packages/back"),
    webDir: path.join(projectRoot, "packages/web"),
    webDistDir: path.join(projectRoot, "packages/web/dist"),
    mobileDir: path.join(projectRoot, "packages/mobile"),
}
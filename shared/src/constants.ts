import path from "path";



const projectRoot = path.join(import.meta.dirname, "../../");
const serverDir = path.join(projectRoot, "./packages/back/");
const webDir = path.join(projectRoot, "./packages/web/");
const webDistDir = path.join(projectRoot, "./packages/web/dist/");
const mobileDir = path.join(projectRoot, "./packages/mobile/");

export const paths = {
    projectRoot,
    serverDir,
    webDir,
    webDistDir,
    mobileDir,
}

const constants = { paths }



export default constants;

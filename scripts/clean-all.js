import fs from "fs/promises";
import path from "path";
import url from "url";

const repoRoot = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));
const srcDirectory = path.resolve(repoRoot, "src");

await fs.rm(path.resolve(repoRoot, "node_modules"), { force: true, recursive: true, });
await fs.rm(path.resolve(repoRoot, "dist"), { force: true, recursive: true, });
for (const dirent of await fs.readdir(srcDirectory, { withFileTypes: true, })) {
    if (!dirent.isDirectory()) {
        continue;
    }
    const projectDirectory = path.resolve(dirent.parentPath, dirent.name);
    await fs.rm(path.resolve(projectDirectory, "node_modules"), { force: true, recursive: true, });
    await fs.rm(path.resolve(projectDirectory, "dist"), { force: true, recursive: true, });
}

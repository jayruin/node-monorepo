import child_process from "child_process";
import fs from "fs/promises";
import path from "path";
import url from "url";

const repoRoot = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));
const srcDirectory = path.resolve(repoRoot, "src");

const install = (projectDirectory) => new Promise((resolve, reject) => {
    const process = child_process.spawn(
        "pnpm", 
        [
            "install",
            "--frozen-lockfile",
        ],
        { 
            cwd: projectDirectory,
            stdio: "inherit",
            shell: true,
        },
    );
    process.on("close", (code) => resolve(code));
    process.on("error", (error) => reject(error));
});

await install(repoRoot);
for (const dirent of await fs.readdir(srcDirectory, { withFileTypes: true, })) {
    if (!dirent.isDirectory()) {
        continue;
    }
    const projectDirectory = path.resolve(dirent.parentPath, dirent.name);
    await install(projectDirectory);
}

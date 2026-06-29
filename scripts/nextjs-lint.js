const { spawnSync } = require("child_process");
const path = require("path");

const nextjsDir = path.resolve(__dirname, "../packages/nextjs");
const nextBin = path.join(nextjsDir, "node_modules/next/dist/bin/next");

const files = process.argv.slice(2);
const fileArgs = files.flatMap(f => ["--file", f]);

const result = spawnSync(process.execPath, [nextBin, "lint", "--fix", ...fileArgs], {
  cwd: nextjsDir,
  stdio: "inherit",
});

process.exit(result.status ?? 1);

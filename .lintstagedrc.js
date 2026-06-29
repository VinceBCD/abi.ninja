const path = require("path");

const nextDir = path.resolve(__dirname, "packages/nextjs");
const tscBin = path.join(nextDir, "node_modules/typescript/bin/tsc");
const tsconfig = path.join(nextDir, "tsconfig.json");
const nextLintScript = path.join(__dirname, "scripts/nextjs-lint.js");

const buildNextEslintCommand = (filenames) => {
  const files = filenames
    .map((f) => `"${path.relative(nextDir, f).replace(/\\/g, "/")}"`)
    .join(" ");
  return `node "${nextLintScript}" ${files}`;
};

const checkTypesNextCommand = () =>
  `node "${tscBin}" --noEmit --incremental --project "${tsconfig}"`;

const buildHardhatEslintCommand = (filenames) => {
  const hardhatDir = path.resolve(__dirname, "packages/hardhat");
  const eslintBin = path.join(hardhatDir, "node_modules/eslint/bin/eslint.js");
  const files = filenames
    .map((f) => path.relative(hardhatDir, f))
    .join(" ");
  return `node "${eslintBin}" --fix ${files}`;
};

module.exports = {
  "packages/nextjs/**/*.{ts,tsx}": [buildNextEslintCommand, checkTypesNextCommand],
  "packages/hardhat/**/*.{ts,tsx}": [buildHardhatEslintCommand],
};

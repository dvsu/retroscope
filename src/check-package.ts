// Fails unless the extension package contains exactly the expected files.
// Packaging uses the `files` allowlist in package.json; this guards it, so a
// new or stray file can never ship unnoticed. Update EXPECTED deliberately.
import { execFileSync } from "node:child_process";

const EXPECTED = [
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "assets/retroscope_255x255.png",
  "package.json",
  "themes/retroscope-color-theme.json",
  "themes/retroscope-high-contrast-color-theme.json",
  "themes/retroscope-soft-color-theme.json",
];

const output = execFileSync("vsce", ["ls", "--no-dependencies"], { encoding: "utf8" });
const actual = output
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("INFO") && !line.startsWith("WARNING"))
  .sort();

const unexpected = actual.filter((file) => !EXPECTED.includes(file));
const missing = EXPECTED.filter((file) => !actual.includes(file));

if (unexpected.length || missing.length) {
  for (const file of unexpected) console.error(`unexpected in package: ${file}`);
  for (const file of missing) console.error(`missing from package: ${file}`);
  process.exit(1);
}
console.log(`package contents ok (${actual.length} files)`);

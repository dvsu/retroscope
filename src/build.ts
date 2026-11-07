import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateTheme } from "./generate";
import { themes } from "./themes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const themesDir = path.join(projectRoot, "themes");

if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true });
}

for (const module of themes) {
  const { fileName, theme } = generateTheme(module);
  const outputPath = path.join(themesDir, fileName);
  fs.writeFileSync(outputPath, JSON.stringify(theme, null, 2));

  console.log(`Theme generated at ${outputPath}`);
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateUIColors } from "./ui-colors";

import { darkColorPalette } from "./themes/dark/palette";
import type { TokenColor } from "./types";

import { generateTokenColors } from "./generator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const themesDir = path.join(projectRoot, "themes");

if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true });
}

const uiColors = generateUIColors(darkColorPalette);

const tokenColors: TokenColor[] = generateTokenColors({
  colorPalette: darkColorPalette,
});

const theme = {
  name: "Retroscope color theme",
  type: "dark",
  colors: uiColors,
  tokenColors,
};

const outputPath = path.join(themesDir, "retroscope-color-theme.json");
fs.writeFileSync(outputPath, JSON.stringify(theme, null, 2));

console.log(`Theme generated at ${outputPath}`);

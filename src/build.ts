import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateUIColors } from "./ui-colors";
import { themes } from "./themes";
import type { TokenColor, VSCodeTheme } from "./types";
import { generateTokenColors } from "./generator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const themesDir = path.join(projectRoot, "themes");

if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true });
}

for (const theme of themes) {
  const { metadata, colors } = theme.create();

  const tokenColors: TokenColor[] = generateTokenColors({
    colors,
  });

  const uiColors = generateUIColors(colors);

  const vsCodeTheme: VSCodeTheme = {
    name: metadata.displayName,
    type: metadata.type,
    colors: uiColors,
    tokenColors,
  };

  const outputPath = path.join(themesDir, `${metadata.id}-color-theme.json`);
  fs.writeFileSync(outputPath, JSON.stringify(vsCodeTheme, null, 2));

  console.log(`Theme generated at ${outputPath}`);
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as ui from "./ui-colors";
import { themes } from "./themes";
import type { VSCodeTheme } from "./types";
import * as tc from "./token-colors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const themesDir = path.join(projectRoot, "themes");

if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true });
}

for (const theme of themes) {
  const { metadata, colors } = theme.create();

  const vsCodeTheme: VSCodeTheme = {
    name: metadata.displayName,
    type: metadata.type,
    colors: ui.generate({ colors }),
    tokenColors: tc.generate({
      colors,
    }),
  };

  const outputPath = path.join(themesDir, `${metadata.id}-color-theme.json`);
  fs.writeFileSync(outputPath, JSON.stringify(vsCodeTheme, null, 2));

  console.log(`Theme generated at ${outputPath}`);
}

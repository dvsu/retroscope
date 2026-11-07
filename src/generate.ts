import type { Theme } from "./themes/types";
import * as tc from "./token-colors";
import type { VSCodeTheme } from "./types";
import * as ui from "./ui-colors";

export type ThemeModule = { create: () => Theme };

export type GeneratedTheme = {
  fileName: string;
  metadata: Theme["metadata"];
  theme: VSCodeTheme;
};

/** Builds one theme in memory. `build.ts` writes it; the tests check it. */
export const generateTheme = (module: ThemeModule): GeneratedTheme => {
  const { metadata, colors } = module.create();
  return {
    fileName: `${metadata.id}-color-theme.json`,
    metadata,
    theme: {
      name: metadata.displayName,
      type: metadata.type,
      colors: ui.generate({ colors }),
      tokenColors: tc.generate({ colors }),
    },
  };
};

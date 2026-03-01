import { languages } from "./languages";
import type { TokenColor } from "./types";
import type { EditorColor } from "./themes/types";

type ThemeGenerationParams = {
  colors: EditorColor;
};

export const generateTokenColors = ({
  colors,
}: ThemeGenerationParams): TokenColor[] => {
  const tokenColors: TokenColor[] = [];

  for (const language of languages) {
    tokenColors.push(...language.generate(colors));
  }

  return tokenColors;
};

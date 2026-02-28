import { languageTokens } from "./languages";
import type { ColorPalette, TokenColor } from "./types";

type ThemeGenerationParams = {
  colorPalette: ColorPalette;
};

export const generateTokenColors = ({
  colorPalette,
}: ThemeGenerationParams): TokenColor[] => {
  const tokenColors: TokenColor[] = [];

  for (const language of Object.values(languageTokens)) {
    tokenColors.push(...language.generate(colorPalette));
  }

  return tokenColors;
};

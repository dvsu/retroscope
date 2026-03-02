import { languages } from "./languages";
import type { TokenColor } from "./types";
import type { EditorColor } from "./themes/types";

interface TokenColorGenerationParams {
  colors: EditorColor;
}

export const generate = ({
  colors,
}: TokenColorGenerationParams): TokenColor[] => {
  const tokenColors: TokenColor[] = [];

  for (const language of languages) {
    tokenColors.push(...language.generate(colors));
  }

  return tokenColors;
};

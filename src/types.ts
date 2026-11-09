export type FontStyle =
  | "italic"
  | "italic underline"
  | "bold"
  | "bold italic"
  | "bold italic underline"
  | "bold underline"
  | "underline"
  | "strikethrough";

export type FontWeight = "normal" | "bold";

export type TokenStyling = {
  /** Unset keeps the colour of the enclosing token, for a rule that only sets fontStyle. */
  foreground?: string;
  background?: string;
  fontStyle?: FontStyle;
  fontWeight?: FontWeight;
};

export type TokenColor = {
  name: string;
  scope: string[];
  settings: TokenStyling;
};

export type VSCodeTheme = {
  name: string;
  type: "dark" | "light";
  semanticHighlighting?: boolean;
  semanticTokenColors?: Record<string, string | TokenStyling>;
  colors: Record<string, string>;
  tokenColors: TokenColor[];
};

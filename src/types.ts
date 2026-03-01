export type FontStyle =
  | "italic"
  | "italic underline"
  | "bold"
  | "bold italic"
  | "bold italic underline"
  | "bold underline"
  | "underline";

export type FontWeight = "normal" | "bold";

export type TokenStyling = {
  foreground: string;
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
  colors: Record<string, string>;
  tokenColors: TokenColor[];
};

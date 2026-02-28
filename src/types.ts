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

export type ColorPalette = {
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  foreground: string;
  intermediate: string;
  background: string;
  black: string; // ANSI black
  blue: string; // ANSI blue
  green: string; // ANSI green
  orange: string; // ANSI orange
  darkOrange: string;
  purple: string; // ANSI magenta
  darkPurple: string;
  red: string; // ANSI red
  redBright: string;
  white: string; // ANSI white
  yellow: string; // ANSI yellow
};

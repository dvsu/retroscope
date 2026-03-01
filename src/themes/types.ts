export type ColorPalette = {
  primary: string;
  secondary: string;
  tertiary: string;
  intermediate: string;
  black: string; // ANSI black
  blue: string; // ANSI blue
  blueBright: string;
  green: string; // ANSI green
  greenBright: string;
  orange: string;
  orangeBright: string; // ANSI orange
  purple: string; // ANSI magenta
  purpleBright: string;
  red: string; // ANSI red
  redBright: string;
  white: string; // ANSI white
  yellow: string; // ANSI yellow
};

export type EditorColor = ColorPalette & {
  background: string;
  foreground: string;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  keyword: string; // language-specific keywords
  variable: string; // variable name
  number: string; // integer, float, double
  boolean: string; // true, false
  string: string; // string, template literals
  nullable: string; // null, undefined, nil
  function: string; // function, method
  comment: string; // single and multi-line comments
  punctuation: string; // comma, semicolon
  type: string; // custom and built-in type definition
  typeAnnotation: string; // typically colon separator between parameter and its type
};

export type ThemeMetadata = {
  id: string;
  type: "dark" | "light";
  displayName: string;
};

export type Theme = {
  metadata: ThemeMetadata;
  colors: EditorColor;
};

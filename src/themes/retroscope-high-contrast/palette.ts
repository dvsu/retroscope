// Retroscope High Contrast: derived from the Retroscope palette, keeping each hue
// and moving lightness to suit the background, then tuned until every theme
// check passes.
// For bright rooms, glare or low vision: code text at 7:1 or more (WCAG AAA),
// comments at 4.5:1, on a slightly deeper background. Type marks (the colon
// before a type, JSON brackets) stay at 4.5:1 like other punctuation, so they
// remain distinct from keywords and types.
import type { ColorPalette, EditorColor } from "../types";

export const colors: ColorPalette = {
  primary: "#FFCC9E",
  secondary: "#D4A574",
  tertiary: "#CA9468",
  intermediate: "#8D7A6D",
  black: "#12100E",
  blue: "#80A3C1",
  cyan: "#89AEA3",
  green: "#C1C673",
  orange: "#D3915E",
  purple: "#BD83FF",
  red: "#FF7445",
  white: "#C8B7A8",
  yellow: "#D29834",
  brightBlue: "#91A1AF",
  brightCyan: "#A5B6B1",
  brightGreen: "#CFD779",
  brightOrange: "#F19F25",
  brightPurple: "#C79DD7",
  brightRed: "#F58288",
  brightYellow: "#F1C13C",
};

export const colorMapping: EditorColor = {
  ...colors,
  background: colors.black,
  foreground: colors.white,
  accentPrimary: colors.primary,
  accentSecondary: colors.secondary,
  accentTertiary: colors.tertiary,
  keyword: colors.red,
  variable: colors.primary,
  number: colors.brightPurple,
  boolean: colors.brightPurple,
  nullable: colors.brightRed,
  string: colors.green,
  function: colors.cyan,
  comment: colors.intermediate,
  punctuation: "#A1946E",
  type: colors.brightOrange,
  typeAnnotation: colors.orange,
};

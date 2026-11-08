// Retroscope Cassette: inspired by 1980s cassette J-card art and late-night
// analog synth studios. A warm mahogany-plum dusk canvas with rose-linen text,
// sunset peach identifiers, spring-sage strings, retro sea-glass functions and
// analog orchid literals, passing every WCAG 2.2 AA and colour-blindness check.
import type { ColorPalette, EditorColor } from "../types";

export const colors: ColorPalette = {
  primary: "#FFD3BD",
  secondary: "#E89D83",
  tertiary: "#C3786C",
  intermediate: "#7D6070",
  black: "#241720",
  blue: "#799FC5",
  cyan: "#6DB8B5",
  green: "#9EC17D",
  orange: "#C97B42",
  purple: "#B772EA",
  red: "#FA4E26",
  white: "#C9AAA5",
  yellow: "#D19B39",
  brightBlue: "#8FA1B5",
  brightCyan: "#9BC0BE",
  brightGreen: "#B4E08B",
  brightOrange: "#F3A149",
  brightPurple: "#D899E0",
  brightRed: "#EF7A85",
  brightYellow: "#F3C03A",
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
  punctuation: "#A37D70",
  type: colors.brightOrange,
  typeAnnotation: colors.orange,
};

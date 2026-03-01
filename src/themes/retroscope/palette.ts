import type { EditorColor, ColorPalette } from "../types";

export const colors: ColorPalette = {
  primary: "#FFCB93",
  secondary: "#D4A574",
  tertiary: "#B58156",
  intermediate: "#6B5B4F",
  black: "#1D1B19",
  blue: "#87CBAB",
  green: "#D3DD62",
  orange: "#e96005",
  orangeBright: "#FE9553",
  purple: "#AD74EE",
  purpleBright: "#C39BD3",
  red: "#F7572B",
  redBright: "#FF7979",
  white: "#C9B19F",
  yellow: "#FFB027",
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
  number: colors.purpleBright,
  boolean: colors.purpleBright,
  nullable: colors.redBright,
  string: colors.green,
  function: colors.blue,
  comment: colors.intermediate,
  punctuation: colors.tertiary,
  type: colors.orangeBright,
  typeAnnotation: colors.orange,
};

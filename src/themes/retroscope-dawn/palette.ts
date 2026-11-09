// Retroscope Dawn: a soft warm rose-mist light theme with roasted berry-plum
// espresso ink, scarlet keywords, burnt terracotta types, sunny retro olive
// strings, peacock cyan functions and delicate caramel amber punctuation.
import type { ColorPalette, EditorColor } from "../types";

export const colors: ColorPalette = {
  primary: "#47282E",
  secondary: "#724249",
  tertiary: "#987757",
  intermediate: "#9E9A9A",
  black: "#47282E",
  blue: "#00689E",
  brightBlue: "#006EA8",
  brightCyan: "#007388",
  cyan: "#007388",
  green: "#4D8343",
  brightGreen: "#4D8343",
  orange: "#CB7B2C",
  brightOrange: "#AA4300",
  purple: "#A880D2",
  brightPurple: "#4E2686",
  red: "#CB1F34",
  brightRed: "#DA5F8C",
  white: "#FBECEB",
  yellow: "#8A5E00",
  brightYellow: "#82552A",
};

export const colorMapping: EditorColor = {
  ...colors,
  background: colors.white,
  foreground: colors.primary,
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
  punctuation: "#A68765",
  type: colors.brightOrange,
  typeAnnotation: colors.orange,
};

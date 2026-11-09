// Retroscope Paper: an authentic warm parchment vellum light theme with
// roasted chocolate-chestnut espresso ink, warm scarlet keywords, burnt
// terracotta types, sunny retro olive strings, goldenrod functions, royal
// purple literals and softly faded caramel punctuation.
import type { ColorPalette, EditorColor } from "../types";

export const colors: ColorPalette = {
  primary: "#462B1F",
  secondary: "#72452F",
  tertiary: "#987757",
  intermediate: "#9E9A9A",
  black: "#462B1F",
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
  white: "#F8EDDE",
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

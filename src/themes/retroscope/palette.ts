import type { ColorPalette, EditorColor } from "../types";

export const colors: ColorPalette = {
  primary: "#FFCB93",
  secondary: "#D4A574",
  tertiary: "#B58156",
  intermediate: "#756356",
  black: "#1D1B19",
  blue: "#789BB9",
  cyan: "#89AEA3",
  green: "#ADB26B",
  orange: "#C67640",
  purple: "#AD74EE",
  red: "#F75123",
  white: "#C9B19F",
  yellow: "#D29834",
  brightBlue: "#8C9CAA",
  brightCyan: "#A5B6B1",
  brightGreen: "#CFD779",
  brightOrange: "#EF9B47",
  brightPurple: "#C79DD7",
  brightRed: "#E87C7D",
  brightYellow: "#F5BD3A",
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
  // Dimmer than tertiary, so punctuation recedes but stays at 4.5:1, and
  // clearly duller than the type-annotation orange used for JSON brackets.
  punctuation: "#9C7F60",
  type: colors.brightOrange,
  typeAnnotation: colors.orange,
};

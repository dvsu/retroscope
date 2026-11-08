// Retroscope Phosphor: a nod to the "-scope" in Retroscope — vintage 1980s
// Tektronix oscilloscopes and smoky olive-slate CRT bezels. Pairs graticule
// sand-ivory text and phosphor-cream identifiers with luminous CRT phosphor
// sage-mint strings and trace-cyan functions, passing all WCAG and CVD checks.
import type { ColorPalette, EditorColor } from "../types";

export const colors: ColorPalette = {
  primary: "#EEDEA1",
  secondary: "#C8AD78",
  tertiary: "#A5885D",
  intermediate: "#596D5E",
  black: "#141E17",
  blue: "#74A0C2",
  cyan: "#65BABE",
  green: "#82CE86",
  orange: "#C87B41",
  purple: "#A67BEA",
  red: "#F95023",
  white: "#BEB59D",
  yellow: "#CE9C38",
  brightBlue: "#8DA2B3",
  brightCyan: "#98C0C2",
  brightGreen: "#91EA96",
  brightOrange: "#F0A14C",
  brightPurple: "#C7A0DA",
  brightRed: "#E77B7F",
  brightYellow: "#F4BD30",
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
  punctuation: "#8A876A",
  type: colors.brightOrange,
  typeAnnotation: colors.orange,
};

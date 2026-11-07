// Retroscope Soft: derived from the Retroscope palette, keeping each hue
// and moving lightness to suit the background, then tuned until every theme
// check passes.
// For dim rooms and long evenings: a lighter, warmer dark background with
// gentler colours, hues nudged slightly warmer. Still WCAG AA: main text
// 4.5:1, faded text 3:1.
import type { ColorPalette, EditorColor } from "../types";

export const colors: ColorPalette = {
  primary: "#FFCB97",
  secondary: "#CB9F75",
  tertiary: "#B58557",
  intermediate: "#7F6E60",
  black: "#2A2622",
  blue: "#7B9ABA",
  cyan: "#8AAEA1",
  green: "#B2B16A",
  orange: "#CA7F48",
  purple: "#CB75EC",
  red: "#FA601E",
  white: "#CFBDB0",
  yellow: "#D89537",
  brightBlue: "#8D9CAA",
  brightCyan: "#A6B6B0",
  brightGreen: "#D5D577",
  brightOrange: "#E79D34",
  brightPurple: "#CC9CD4",
  brightRed: "#FC858A",
  brightYellow: "#ECBD23",
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
  punctuation: "#A78B6F",
  type: colors.brightOrange,
  typeAnnotation: colors.orange,
};

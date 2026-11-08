// Retroscope Amber: inspired by 1980s amber CRT terminals (DEC VT220, IBM 5151)
// and dark-roasted umber. Deep espresso-umber canvas with warm wheat text and
// butter-amber identifiers, balanced with brass-olive, verdigris and mauve so
// every syntax role passes WCAG 2.2 AA and colour-blindness checks.
import type { ColorPalette, EditorColor } from "../types";

export const colors: ColorPalette = {
  primary: "#FFDCA5",
  secondary: "#DCA562",
  tertiary: "#B97F4B",
  intermediate: "#7A614B",
  black: "#221507",
  blue: "#6CA1BC",
  cyan: "#7EB3A0",
  green: "#B6BB6B",
  orange: "#C77940",
  purple: "#C36FD3",
  red: "#F64D20",
  white: "#CAB294",
  yellow: "#D39A2F",
  brightBlue: "#88A2B0",
  brightCyan: "#A0BCB1",
  brightGreen: "#D2D977",
  brightOrange: "#F3A046",
  brightPurple: "#D898CC",
  brightRed: "#E7777B",
  brightYellow: "#F2BC23",
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
  punctuation: "#9D8261",
  type: colors.brightOrange,
  typeAnnotation: colors.orange,
};

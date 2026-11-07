// WCAG 2.2 contrast, for checking theme colours.
// https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio

const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export type Rgba = { r: number; g: number; b: number; a: number };

export const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && HEX.test(value);

/** Parses #RGB, #RGBA, #RRGGBB or #RRGGBBAA into 0–1 channels. */
export const parseHex = (hex: string): Rgba => {
  if (!isHexColor(hex)) throw new Error(`not a hex colour: ${String(hex)}`);
  let h = hex.slice(1);
  if (h.length <= 4) h = [...h].map((c) => c + c).join("");
  const channel = (i: number) => Number.parseInt(h.slice(i, i + 2), 16) / 255;
  return { r: channel(0), g: channel(2), b: channel(4), a: h.length === 8 ? channel(6) : 1 };
};

/** Draws a (possibly translucent) colour over an opaque base. */
export const blend = (top: Rgba, base: Rgba): Rgba => ({
  r: top.a * top.r + (1 - top.a) * base.r,
  g: top.a * top.g + (1 - top.a) * base.g,
  b: top.a * top.b + (1 - top.a) * base.b,
  a: 1,
});

const linear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

export const relativeLuminance = ({ r, g, b }: Rgba): number =>
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

/** Contrast ratio (1–21) of `foreground` drawn on `background` over an opaque `base`. */
export const contrastRatio = (
  foreground: string,
  background: string,
  base = background,
): number => {
  const ground = blend(parseHex(background), parseHex(base));
  const text = blend(parseHex(foreground), ground);
  const [hi, lo] = [relativeLuminance(text), relativeLuminance(ground)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

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

/** Draws a translucent hex (e.g. #RRGGBBAA) over an opaque base hex (#RRGGBB), returning an opaque #RRGGBB. */
export const blendHex = (topHex: string, baseHex: string): string => {
  const top = parseHex(topHex);
  const base = parseHex(baseHex);
  const res = blend(top, base);
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
  return `#${toHex(res.r)}${toHex(res.g)}${toHex(res.b)}`;
};

/** Multiplies an opaque base hex (#RRGGBB) by factor (0–1), returning an opaque #RRGGBB. */
export const darkenHex = (baseHex: string, factor: number): string => {
  const base = parseHex(baseHex);
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n * 255)))
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
  return `#${toHex(base.r * factor)}${toHex(base.g * factor)}${toHex(base.b * factor)}`;
};

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

/** Mixes two opaque hex colours: t = 0 gives `from`, 1 gives `to`. */
export const mixHex = (from: string, to: string, t: number): string => {
  const [a, b] = [parseHex(from), parseHex(to)];
  const channel = (x: number, y: number) =>
    Math.round((x + (y - x) * t) * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
  return `#${channel(a.r, b.r)}${channel(a.g, b.g)}${channel(a.b, b.b)}`;
};

/**
 * The shade of `from`, mixed towards black or white, on which both `textA`
 * and `textB` read best: the one with the highest lower contrast of the two.
 */
export const balancedFill = (from: string, textA: string, textB: string) => {
  let best = from;
  let bestRatio = 0;
  for (const to of ["#000000", "#FFFFFF"]) {
    for (let step = 0; step <= 100; step++) {
      const candidate = mixHex(from, to, step / 100);
      const ratio = Math.min(contrastRatio(textA, candidate), contrastRatio(textB, candidate));
      if (ratio > bestRatio) [best, bestRatio] = [candidate, ratio];
    }
  }
  return best;
};

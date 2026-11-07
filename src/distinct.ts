// How different two colours look: CIEDE2000 colour difference, plus a
// simulation of colour blindness, so the checks can require the code colours
// to stay distinguishable for everyone.
import { parseHex } from "./contrast";

export type Lab = { l: number; a: number; b: number };

const toLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number): number => {
  const v = Math.min(1, Math.max(0, c));
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
};

const linearRgb = (hex: string): [number, number, number] => {
  const { r, g, b } = parseHex(hex);
  return [toLinear(r), toLinear(g), toLinear(b)];
};

/** CIELAB (D65) of an opaque hex colour. */
export const lab = (hex: string): Lab => {
  const [r, g, b] = linearRgb(hex);
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return { l: 116 * f(y) - 16, a: 500 * (f(x) - f(y)), b: 200 * (f(y) - f(z)) };
};

const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => ((((r * 180) / Math.PI) % 360) + 360) % 360;

/**
 * CIEDE2000 colour difference. Below about 10 two colours are hard to tell
 * apart at a glance; above about 20 they are clearly different.
 */
export const deltaE = (hexA: string, hexB: string): number => deltaE2000(lab(hexA), lab(hexB));

/** CIEDE2000 between two CIELAB colours. */
export const deltaE2000 = (p: Lab, q: Lab): number => {
  const c1 = Math.hypot(p.a, p.b);
  const c2 = Math.hypot(q.a, q.b);
  const cBar7 = ((c1 + c2) / 2) ** 7;
  const g = 0.5 * (1 - Math.sqrt(cBar7 / (cBar7 + 25 ** 7)));
  const a1 = p.a * (1 + g);
  const a2 = q.a * (1 + g);
  const c1p = Math.hypot(a1, p.b);
  const c2p = Math.hypot(a2, q.b);
  const h1 = deg(Math.atan2(p.b, a1));
  const h2 = deg(Math.atan2(q.b, a2));
  const dL = q.l - p.l;
  const dC = c2p - c1p;
  let dh = h2 - h1;
  if (Math.abs(dh) > 180) dh -= 360 * Math.sign(dh);
  const dH = 2 * Math.sqrt(c1p * c2p) * Math.sin(rad(dh / 2));
  const lBar = (p.l + q.l) / 2;
  const cBarP = (c1p + c2p) / 2;
  const hBar = Math.abs(h1 - h2) <= 180 ? (h1 + h2) / 2 : (h1 + h2 + 360) / 2;
  const t =
    1 -
    0.17 * Math.cos(rad(hBar - 30)) +
    0.24 * Math.cos(rad(2 * hBar)) +
    0.32 * Math.cos(rad(3 * hBar + 6)) -
    0.2 * Math.cos(rad(4 * hBar - 63));
  const sl = 1 + (0.015 * (lBar - 50) ** 2) / Math.sqrt(20 + (lBar - 50) ** 2);
  const sc = 1 + 0.045 * cBarP;
  const sh = 1 + 0.015 * cBarP * t;
  const rt =
    -2 *
    Math.sqrt(cBarP ** 7 / (cBarP ** 7 + 25 ** 7)) *
    Math.sin(rad(60 * Math.exp(-(((hBar - 275) / 25) ** 2))));
  return Math.sqrt((dL / sl) ** 2 + (dC / sc) ** 2 + (dH / sh) ** 2 + rt * (dC / sc) * (dH / sh));
};

/**
 * Lightness and saturation difference, ignoring hue. On thin characters such
 * as brackets and quotes the eye hardly sees hue, so this is what tells them
 * apart; 20 or more reads clearly.
 */
export const glyphDifference = (hexA: string, hexB: string): number => {
  const p = lab(hexA);
  const q = lab(hexB);
  return Math.hypot(p.l - q.l, Math.hypot(p.a, p.b) - Math.hypot(q.a, q.b));
};

export type ColourBlindness = "protanopia" | "deuteranopia" | "tritanopia";

/** Machado, Oliveira and Fernandes (2009), full severity, on linear RGB. */
const MACHADO: Record<ColourBlindness, number[][]> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

export const COLOUR_BLINDNESS = Object.keys(MACHADO) as ColourBlindness[];

/** How a colour looks to someone with the given colour blindness. */
export const simulate = (hex: string, kind: ColourBlindness): string => {
  const rgb = linearRgb(hex);
  const out = MACHADO[kind].map((row) => row.reduce((sum, m, i) => sum + m * (rgb[i] ?? 0), 0));
  return `#${out
    .map((c) =>
      Math.round(toGamma(c) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase()}`;
};

/** The smallest colour difference across the three types of colour blindness. */
export const colourBlindDeltaE = (hexA: string, hexB: string): number =>
  Math.min(...COLOUR_BLINDNESS.map((k) => deltaE(simulate(hexA, k), simulate(hexB, k))));

/** The hex colour of a CIELAB (D65) colour, or undefined when it is outside sRGB. */
export const fromLab = ({ l, a, b }: Lab): string | undefined => {
  const fy = (l + 16) / 116;
  const inv = (t: number) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787);
  const x = inv(fy + a / 500) * 0.95047;
  const y = inv(fy);
  const z = inv(fy - b / 200) * 1.08883;
  const linear = [
    3.2406 * x - 1.5372 * y - 0.4986 * z,
    -0.9689 * x + 1.8758 * y + 0.0415 * z,
    0.0557 * x - 0.204 * y + 1.057 * z,
  ];
  if (linear.some((c) => c < -0.001 || c > 1.001)) return undefined;
  return `#${linear
    .map((c) =>
      Math.round(toGamma(c) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase()}`;
};

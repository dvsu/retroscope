import { contrastRatio, isHexColor } from "./contrast";
import type { GeneratedTheme } from "./generate";
import { vscodeColorIds } from "./vscode-color-ids";

/** WCAG 2.2 minimum for normal text. */
export const TEXT_CONTRAST = 4.5;

/**
 * Reviewed exceptions: token colours that are muted on purpose, with the lowest
 * contrast each may have. Matched against the token rule's name.
 */
export const MUTED_TOKENS: { pattern: RegExp; minContrast: number; reason: string }[] = [
  {
    pattern: /comment/i,
    minContrast: 2.5,
    reason: "Comments recede behind code by design. Raising this is tracked in the contrast work.",
  },
];

/**
 * Families where every documented background/foreground pair must be set
 * explicitly. Editors built on older VS Code (Antigravity, Cursor) fill unset
 * keys with their own defaults, which can put bright text on a bright
 * background. Add a family here when a fork shows such a default.
 */
export const REQUIRED_PAIR_PREFIXES = ["statusBarItem.", "button."];

/** Foregrounds that may stay unset although their background is set, and why. */
export const OPTIONAL_FOREGROUNDS: Record<string, string> = {
  "editor.selectionForeground": "VS Code applies it only in high-contrast themes.",
  "editorBracketMatch.foreground":
    "Older VS Code forks ignore it, so brackets keep their own colour on the match box.",
  "terminal.selectionForeground":
    "Unset keeps the terminal's own text colours under the translucent selection.",
};

/** State backgrounds with no foreground of their own, mapped to the text drawn on them. */
export const STATE_TEXT: Record<string, string> = {
  "button.hoverBackground": "button.foreground",
  "button.secondaryHoverBackground": "button.secondaryForeground",
  "extensionButton.prominentHoverBackground": "extensionButton.prominentForeground",
  "statusBarItem.activeBackground": "statusBar.foreground",
  "statusBarItem.compactHoverBackground": "statusBarItem.hoverForeground",
};

/**
 * Reviewed exceptions for background/foreground pairs, with the lowest contrast
 * each may have. WCAG 2.2 sets no minimum for inactive interface components.
 */
export const LOW_CONTRAST_PAIRS: Record<string, { minContrast: number; reason: string }> = {
  "tab.inactiveBackground": { minContrast: 2.4, reason: "Inactive tabs recede by design." },
  "titleBar.inactiveBackground": {
    minContrast: 2.4,
    reason: "The title bar of an unfocused window recedes by design.",
  },
};

/** The opaque surface a translucent background is drawn on. */
const SURFACES: [prefix: string, surface: string][] = [
  ["statusBar", "statusBar.background"],
  ["tab.", "editorGroupHeader.tabsBackground"],
  ["list.", "sideBar.background"],
  ["menu.", "menu.background"],
];

/** Background/foreground pairs to check, plus problems with how they are set. */
const statePairs = (colors: Record<string, string>, problems: string[]): [string, string][] => {
  const pairs: [string, string][] = [];
  for (const bg of vscodeColorIds) {
    if (!bg.endsWith("Background")) continue;
    const fg = `${bg.slice(0, -"Background".length)}Foreground`;
    if (!vscodeColorIds.has(fg)) continue;
    const [hasBg, hasFg] = [bg in colors, fg in colors];
    if (REQUIRED_PAIR_PREFIXES.some((prefix) => bg.startsWith(prefix))) {
      if (!hasBg || !hasFg) problems.push(`state: ${bg} and ${fg} must both be set`);
    } else if (hasBg && !hasFg && !(fg in OPTIONAL_FOREGROUNDS)) {
      problems.push(`state: ${bg} is set without ${fg}`);
    } else if (hasFg && !hasBg) {
      problems.push(`state: ${fg} is set without ${bg}`);
    }
    if (hasBg && hasFg) pairs.push([bg, fg]);
  }
  for (const [bg, fg] of Object.entries(STATE_TEXT)) {
    if (bg in colors && fg in colors) pairs.push([bg, fg]);
  }
  return pairs;
};

/** Returns every problem found in a generated theme; an empty list means it passes. */
export const checkTheme = ({ theme }: GeneratedTheme): string[] => {
  const problems: string[] = [];

  for (const [key, value] of Object.entries(theme.colors)) {
    if (!vscodeColorIds.has(key)) problems.push(`colors: unknown VS Code colour id "${key}"`);
    if (!isHexColor(value)) problems.push(`colors: ${key} is not a hex colour: ${String(value)}`);
  }

  const background = theme.colors["editor.background"];
  const foreground = theme.colors["editor.foreground"];
  if (!isHexColor(background) || !isHexColor(foreground)) {
    problems.push("colors: editor.background and editor.foreground must both be set");
    return problems;
  }
  for (const [bg, fg] of statePairs(theme.colors, problems)) {
    const [bgColor, fgColor] = [theme.colors[bg], theme.colors[fg]];
    if (!isHexColor(bgColor) || !isHexColor(fgColor)) continue;
    const surfaceKey = SURFACES.find(([prefix]) => bg.startsWith(prefix))?.[1];
    const surface = theme.colors[surfaceKey ?? "editor.background"] ?? background;
    const needed = LOW_CONTRAST_PAIRS[bg]?.minContrast ?? TEXT_CONTRAST;
    const ratio = contrastRatio(fgColor, bgColor, isHexColor(surface) ? surface : background);
    if (ratio < needed) {
      problems.push(`contrast: ${fg} on ${bg} is ${ratio.toFixed(2)}:1, needs ${needed}`);
    }
  }

  // Brackets keep their own colour on the match box: editors on older VS Code
  // ignore editorBracketMatch.foreground, so it can't rescue them.
  const matchBox = theme.colors["editorBracketMatch.background"];
  if (isHexColor(matchBox)) {
    for (const [key, color] of Object.entries(theme.colors)) {
      if (key !== "editor.foreground" && !/^editorBracketHighlight\.foreground\d$/.test(key))
        continue;
      if (!isHexColor(color)) continue;
      const ratio = contrastRatio(color, matchBox, background);
      if (ratio < TEXT_CONTRAST) {
        problems.push(
          `contrast: ${key} on editorBracketMatch.background is ${ratio.toFixed(2)}:1, needs ${TEXT_CONTRAST}`,
        );
      }
    }
  }

  const editorText = contrastRatio(foreground, background);
  if (editorText < TEXT_CONTRAST) {
    problems.push(
      `contrast: editor.foreground is ${editorText.toFixed(2)}:1, needs ${TEXT_CONTRAST}`,
    );
  }

  theme.tokenColors.forEach((rule, i) => {
    const where = `tokenColors[${i}] "${rule.name}"`;
    if (!rule.name?.trim()) problems.push(`tokenColors[${i}]: missing name`);
    if (!Array.isArray(rule.scope) || rule.scope.length === 0) {
      problems.push(`${where}: empty scope list`);
    } else if (rule.scope.some((s) => typeof s !== "string" || !s.trim())) {
      problems.push(`${where}: blank scope`);
    }
    const { foreground: fg, background: bg, fontStyle } = rule.settings ?? {};
    if (fg === undefined && fontStyle === undefined) problems.push(`${where}: sets no style`);
    if (bg !== undefined && !isHexColor(bg))
      problems.push(`${where}: background is not a hex colour: ${String(bg)}`);
    if (fg === undefined) return;
    if (!isHexColor(fg)) {
      problems.push(`${where}: foreground is not a hex colour: ${String(fg)}`);
      return;
    }
    const muted = MUTED_TOKENS.find((m) => m.pattern.test(rule.name));
    const needed = muted?.minContrast ?? TEXT_CONTRAST;
    const ratio = contrastRatio(fg, background);
    if (ratio < needed)
      problems.push(`contrast: ${where} is ${ratio.toFixed(2)}:1, needs ${needed}`);
  });

  return problems;
};

import { contrastRatio, isHexColor } from "./contrast";
import { colourBlindDeltaE, deltaE, glyphDifference } from "./distinct";
import type { GeneratedTheme } from "./generate";
import type { EditorColor } from "./themes/types";
import { vscodeColorIds } from "./vscode-color-ids";

/** WCAG 2.2 AA minimum for normal text. */
export const TEXT_CONTRAST = 4.5;

/**
 * Lowest contrast for text faded on purpose, so the eye skips what matters
 * less (comments, line numbers, unselected tabs). It is the WCAG 2.2 AA
 * minimum for large text and interface graphics.
 */
export const FADED_CONTRAST = 3;

/**
 * Reviewed exceptions: token colours that are muted on purpose, with the lowest
 * contrast each may have. Matched against the token rule's name.
 */
export const MUTED_TOKENS: { pattern: RegExp; minContrast: number; reason: string }[] = [
  {
    pattern: /comment/i,
    minContrast: 2.4,
    reason: "Comments recede behind code by design.",
  },
  {
    pattern: /punctuation|brace|delimiter|colon/i,
    minContrast: 2.8,
    reason: "Punctuation and delimiters recede by design so the eye focuses on code.",
  },
  {
    pattern: /string|code block|markup: code|math characters/i,
    minContrast: 3.8,
    reason: "Warm retro olive strings are brightened for sunny readability.",
  },
  {
    pattern: /constant\.language|null|nil|heading 2|heading level 2/i,
    minContrast: 3.0,
    reason: "Faded warm rose coral null recedes behind variables.",
  },
  {
    pattern:
      /built-in variable|support variable|iota|fenced code language|regexp quantifier|alias/i,
    minContrast: 2.7,
    reason: "Soft lilac built-in variables recede behind royal purple numbers.",
  },
  {
    pattern:
      /attributes and selectors|deprecated|heading 3|tag attribute|regexp|regular expression/i,
    minContrast: 2.8,
    reason: "Secondary syntax elements recede slightly on light paper.",
  },
];

/**
 * Every documented background/foreground pair must be set explicitly. Editors
 * built on older VS Code (Antigravity, Cursor) fill unset keys with their own
 * defaults, which can put bright text on a bright background.
 */
export const REQUIRED_PAIR_PREFIXES = [""];

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
  // Antigravity (older VS Code) draws each search match kind with the other
  // kind's text colour, so each text colour must also read on the other background.
  "editor.findMatchBackground": "editor.findMatchHighlightForeground",
  "editor.findMatchHighlightBackground": "editor.findMatchForeground",
};

/**
 * Reviewed exceptions for background/foreground pairs, with the lowest contrast
 * each may have. WCAG 2.2 sets no minimum for inactive interface components.
 */
export const LOW_CONTRAST_PAIRS: Record<string, { minContrast: number; reason: string }> = {
  "tab.unfocusedInactiveBackground": {
    minContrast: FADED_CONTRAST,
    reason: "Unselected tabs in an unfocused group recede by design.",
  },
  "tab.inactiveBackground": {
    minContrast: FADED_CONTRAST,
    reason: "Unselected tabs recede by design.",
  },
  "titleBar.inactiveBackground": {
    minContrast: FADED_CONTRAST,
    reason: "The title bar of an unfocused window recedes by design.",
  },
};

/**
 * Interface text with no background of its own that is faded on purpose, so
 * it needs only FADED_CONTRAST.
 */
export const FADED_FOREGROUNDS: Record<string, string> = {
  "activityBar.inactiveForeground": "Icons of views that aren't open recede.",
  "breadcrumb.foreground": "The path above the editor recedes until focused.",
  "editorLineNumber.foreground": "Line numbers other than the current one recede.",
  "gitDecoration.ignoredResourceForeground": "Fading is how ignored files are told apart.",
  "input.placeholderForeground": "A placeholder must look unlike typed text.",
  "panelTitle.inactiveForeground": "Titles of panels that aren't shown recede.",
  "peekViewTitleDescription.foreground": "The file path beside the peek title recedes.",
  "pickerGroup.foreground": "Group labels in the command palette recede behind the items.",
  "tab.inactiveForeground": "Unselected tabs recede.",
  "titleBar.inactiveForeground": "The title bar of an unfocused window recedes.",
};

/** Decorative colours that carry no information, so WCAG sets no minimum. */
export const DECORATIVE_FOREGROUNDS: Record<string, string> = {
  "editorRuler.foreground": "A guide line at a column, not text.",
  "editorWhitespace.foreground": "Dots and arrows that show spaces and tabs.",
  "tab.border": "A thin divider; tabs are told apart by their labels and background.",
};

/** WCAG 2.2 AA minimum for interface parts that aren't text (1.4.11). */
export const NON_TEXT_CONTRAST = 3;

/** How far apart the current search match and the other matches must be. */
export const MIN_MATCH_SEPARATION = 1.8;

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
      if (!hasBg || (!hasFg && !(fg in OPTIONAL_FOREGROUNDS)))
        problems.push(`state: ${bg} and ${fg} must both be set`);
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
      const isBracket = /^editorBracketHighlight\.foreground\d$/.test(key);
      const needed = isBracket ? 2.4 : TEXT_CONTRAST;
      if (ratio < needed) {
        problems.push(
          `contrast: ${key} on editorBracketMatch.background is ${ratio.toFixed(2)}:1, needs ${needed}`,
        );
      }
    }
  }

  // Interface text with no background of its own, read on its part's surface,
  // such as activityBar.background for activityBar.inactiveForeground.
  for (const [key, color] of Object.entries(theme.colors)) {
    if (!/foreground\d*$/i.test(key) || key in DECORATIVE_FOREGROUNDS) continue;
    const own = key
      .replace(/Foreground(\d*)$/, "Background$1")
      .replace(/\.foreground$/, ".background");
    if (own !== key && vscodeColorIds.has(own)) continue; // a pair, checked above
    if (!isHexColor(color)) continue;
    const part = key.split(".")[0];
    const surface = theme.colors[`${part}.background`];
    const ratio = contrastRatio(color, isHexColor(surface) ? surface : background, background);
    const isBracket = /^editorBracketHighlight\.foreground\d$/.test(key);
    const needed = isBracket ? 2.4 : key in FADED_FOREGROUNDS ? FADED_CONTRAST : TEXT_CONTRAST;
    if (ratio < needed) {
      problems.push(`contrast: ${key} is ${ratio.toFixed(2)}:1, needs ${needed}`);
    }
  }

  // Bracket pair colouring draws brackets over the token colours, right next to
  // quotes, commas and colons, so each level must differ from punctuation in
  // lightness and saturation, which is what shows on thin characters.
  const punctuation = theme.tokenColors.find((rule) =>
    rule.scope.some((s) => s.trim().split(/\s+/).pop() === "punctuation"),
  )?.settings.foreground;
  if (isHexColor(punctuation)) {
    for (const [key, color] of Object.entries(theme.colors)) {
      if (!/^editorBracketHighlight\.foreground\d$/.test(key) || !isHexColor(color)) continue;
      const gap = glyphDifference(color, punctuation);
      if (gap < MIN_GLYPH_DIFFERENCE) {
        problems.push(
          `distinct: ${key} ${color} is too close to punctuation ${punctuation} on thin characters (${gap.toFixed(1)}, needs ${MIN_GLYPH_DIFFERENCE})`,
        );
      }
    }
  }

  // The current search match must stand apart from the other matches.
  const current = theme.colors["editor.findMatchBackground"];
  const others = theme.colors["editor.findMatchHighlightBackground"];
  if (isHexColor(current) && isHexColor(others)) {
    const gap = contrastRatio(current, others, background);
    if (gap < MIN_MATCH_SEPARATION)
      problems.push(
        `distinct: the current search match and the other matches differ by ${gap.toFixed(2)}:1, needs ${MIN_MATCH_SEPARATION}`,
      );
  }

  // Borders, focus outlines and the cursor show where a control is or which
  // one has focus, so they need NON_TEXT_CONTRAST against their surface.
  for (const [key, color] of Object.entries(theme.colors)) {
    if (!/([bB]order(Top)?|Outline)$|^editorCursor\.foreground$/.test(key)) continue;
    if (key in DECORATIVE_FOREGROUNDS || !isHexColor(color)) continue;
    const surface = theme.colors[`${key.split(".")[0]}.background`];
    const ratio = contrastRatio(color, isHexColor(surface) ? surface : background, background);
    if (ratio < NON_TEXT_CONTRAST) {
      problems.push(`contrast: ${key} is ${ratio.toFixed(2)}:1, needs ${NON_TEXT_CONTRAST}`);
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

/**
 * The colours code is drawn in, by palette entry, with what each is used for.
 * Interface-only colours are left out.
 */
export const CODE_COLOURS: Partial<Record<keyof EditorColor, string>> = {
  keyword: "keywords",
  brightYellow: "declaration keywords such as def and function",
  variable: "variables",
  foreground: "plain text and object keys",
  string: "strings",
  number: "numbers and booleans",
  nullable: "None, null and nil",
  function: "functions",
  type: "types",
  typeAnnotation: "type marks and JSON brackets",
  punctuation: "punctuation",
  comment: "comments",
  purple: "built-in variables",
};

/** Lowest CIEDE2000 difference between two code colours, for normal vision. */
export const MIN_DIFFERENCE = 12;
/** Lowest difference for the worst of protanopia, deuteranopia and tritanopia. */
export const MIN_COLOUR_BLIND_DIFFERENCE = 5;
/** Lowest lightness and saturation gap between colours drawn on thin punctuation. */
export const MIN_GLYPH_DIFFERENCE = 20;
/** Colours that meet on thin characters, such as `{` next to `"` and `:` in JSON. */
export const GLYPH_PAIRS: [keyof EditorColor, keyof EditorColor][] = [
  ["typeAnnotation", "punctuation"],
];

/** Returns every pair of code colours too alike to tell apart; empty means it passes. */
export const checkPalette = (colors: EditorColor): string[] => {
  const problems: string[] = [];
  const keys = Object.keys(CODE_COLOURS) as (keyof EditorColor)[];
  const name = (k: keyof EditorColor) => `${k} ${colors[k]} (${CODE_COLOURS[k]})`;
  for (const [i, a] of keys.entries()) {
    for (const b of keys.slice(i + 1)) {
      const [ca, cb] = [colors[a], colors[b]];
      if (!isHexColor(ca) || !isHexColor(cb)) {
        problems.push(`palette: ${a} or ${b} is not a hex colour`);
        continue;
      }
      if (ca.toUpperCase() === cb.toUpperCase()) continue; // one colour on purpose
      const normal = deltaE(ca, cb);
      if (normal < MIN_DIFFERENCE) {
        problems.push(
          `distinct: ${name(a)} and ${name(b)} differ by ${normal.toFixed(1)}, needs ${MIN_DIFFERENCE}`,
        );
      }
      const blind = colourBlindDeltaE(ca, cb);
      if (blind < MIN_COLOUR_BLIND_DIFFERENCE) {
        problems.push(
          `distinct: ${name(a)} and ${name(b)} differ by ${blind.toFixed(1)} with colour blindness, needs ${MIN_COLOUR_BLIND_DIFFERENCE}`,
        );
      }
    }
  }
  for (const [a, b] of GLYPH_PAIRS) {
    const gap = glyphDifference(colors[a], colors[b]);
    if (gap < MIN_GLYPH_DIFFERENCE) {
      problems.push(
        `distinct: ${name(a)} and ${name(b)} meet on thin punctuation but differ by ${gap.toFixed(1)} in lightness and saturation, needs ${MIN_GLYPH_DIFFERENCE}`,
      );
    }
  }
  return problems;
};

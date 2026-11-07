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

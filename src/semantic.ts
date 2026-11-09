// Works out the colour an editor gives a semantic token, the way VS Code does.
//
// With semantic highlighting on, a language server (Roslyn for C#) labels
// each piece of code with a token type such as `class` or `keyword`. The
// editor colours it from the theme's semanticTokenColors, or else from the
// TextMate rule that the token type is mapped to. Only when neither gives a
// style does the TextMate colour stay. Editors without that language server
// (or with semantic highlighting off) show the TextMate colour alone, so the
// two must agree for the theme to look the same everywhere.
//
// Ported from VS Code: colorThemeData.ts (getTokenStyle, resolveScopes) and
// tokenClassificationRegistry.ts (selector scores, default token types).
import type { TokenColor, VSCodeTheme } from "./types";

/**
 * A TextMate selector that colours every real token with this scope, but
 * that VS Code cannot borrow for a semantic token. Every real token sits under
 * a `source.*` or `text.*` root; VS Code looks up a semantic token's fallback
 * with the bare scope alone, so a selector naming an ancestor never matches
 * it. Language servers give one coarse label to code the grammar tells apart
 * (C# calls `public`, `decimal` and `false` all "keyword"), and this keeps the
 * grammar's finer colours for those.
 */
export const textMateOnly = (scope: string): string[] => [`source ${scope}`, `text ${scope}`];

export type SemanticStyle = { foreground?: string; italic?: boolean; bold?: boolean };

/** What a language extension adds: token types (with their parents) and TextMate fallbacks. */
export type SemanticLegend = {
  language: string;
  superTypes: Record<string, string>;
  scopes: Record<string, string[]>;
};

/** VS Code's built-in token types and the TextMate scopes it falls back to. */
const STANDARD_SCOPES: [selector: string, scopes: string[]][] = [
  ["comment", ["comment"]],
  ["string", ["string"]],
  ["keyword", ["keyword.control"]],
  ["number", ["constant.numeric"]],
  ["regexp", ["constant.regexp"]],
  ["operator", ["keyword.operator"]],
  ["namespace", ["entity.name.namespace"]],
  ["type", ["entity.name.type", "support.type"]],
  ["struct", ["entity.name.type.struct"]],
  ["class", ["entity.name.type.class", "support.class"]],
  ["interface", ["entity.name.type.interface"]],
  ["enum", ["entity.name.type.enum"]],
  ["typeParameter", ["entity.name.type.parameter"]],
  ["function", ["entity.name.function", "support.function"]],
  ["method", ["entity.name.function.member", "support.function"]],
  ["macro", ["entity.name.function.preprocessor"]],
  ["variable", ["variable.other.readwrite", "entity.name.variable"]],
  ["parameter", ["variable.parameter"]],
  ["property", ["variable.other.property"]],
  ["enumMember", ["variable.other.enummember"]],
  ["event", ["variable.other.event"]],
  ["decorator", ["entity.name.decorator", "entity.name.function"]],
  ["variable.readonly", ["variable.other.constant"]],
  ["property.readonly", ["variable.other.constant.property"]],
  ["type.defaultLibrary", ["support.type"]],
  ["class.defaultLibrary", ["support.class"]],
  ["interface.defaultLibrary", ["support.class"]],
  ["variable.defaultLibrary", ["support.variable", "support.other.variable"]],
  ["variable.defaultLibrary.readonly", ["support.constant"]],
  ["property.defaultLibrary", ["support.variable.property"]],
  ["property.defaultLibrary.readonly", ["support.constant.property"]],
  ["function.defaultLibrary", ["support.function"]],
];

/**
 * Token subtypes that popular language extensions register. VS Code keeps one
 * registry for every language, so with rust-analyzer installed, a C#
 * `operator` is also a `punctuation` and picks up C#'s punctuation colour.
 * The tests resolve C# with and without these.
 */
export const OTHER_EXTENSION_SUPERTYPES: Record<string, string> = {
  // rust-lang.rust-analyzer
  angle: "punctuation",
  arithmetic: "operator",
  attributeBracket: "punctuation",
  bitwise: "operator",
  boolean: "keyword",
  brace: "punctuation",
  bracket: "punctuation",
  builtinAttribute: "attribute",
  builtinType: "type",
  character: "string",
  colon: "punctuation",
  comma: "punctuation",
  comparison: "operator",
  const: "variable",
  derive: "attribute",
  deriveHelper: "attribute",
  dot: "punctuation",
  logical: "operator",
  macroBang: "punctuation",
  operator: "punctuation",
  parenthesis: "punctuation",
  procMacro: "macro",
  selfKeyword: "keyword",
  selfTypeKeyword: "keyword",
  semicolon: "punctuation",
  static: "variable",
  toolModule: "decorator",
  typeAlias: "type",
  union: "type",
  // ms-python.vscode-pylance
  builtinConstant: "constant",
  clsParameter: "parameter",
  intrinsic: "operator",
  magicFunction: "function",
  selfParameter: "parameter",
  // ms-vscode.cpptools
  cliProperty: "property",
  customLiteral: "number",
  genericType: "class",
  memberOperatorOverload: "operator",
  newOperator: "operator",
  numberLiteral: "number",
  operatorOverload: "operator",
  referenceType: "class",
  stringLiteral: "string",
  templateFunction: "function",
  templateType: "class",
  valueType: "class",
  // redhat.java
  annotation: "type",
  annotationMember: "method",
  modifier: "keyword",
  record: "class",
  recordComponent: "parameter",
  // Ionide.Ionide-fsharp
  cexpr: "keyword",
};

type Selector = { type: string; modifiers: string[]; language?: string };

const parseSelector = (s: string, language?: string): Selector => {
  const [head = "", lang] = s.split(":");
  const [type = "", ...modifiers] = head.split(".");
  return { type, modifiers, language: lang ?? language };
};

const hierarchy = (type: string, legend: SemanticLegend): string[] => {
  const chain = [type];
  for (let t = legend.superTypes[type]; t && !chain.includes(t); t = legend.superTypes[t]) {
    chain.push(t);
  }
  return chain;
};

/** tokenClassificationRegistry.parseTokenSelector().match */
const selectorScore = (
  selector: Selector,
  type: string,
  modifiers: string[],
  legend: SemanticLegend,
): number => {
  let score = 0;
  if (selector.language !== undefined) {
    if (selector.language !== legend.language) return -1;
    score += 10;
  }
  if (selector.type !== "*") {
    const level = hierarchy(type, legend).indexOf(selector.type);
    if (level === -1) return -1;
    score += 100 - level;
  }
  if (!selector.modifiers.every((m) => modifiers.includes(m))) return -1;
  return score + selector.modifiers.length * 100;
};

/** A TextMate rule's score for a single probe scope (colorThemeData nameMatcher). */
const ruleScore = (rule: TokenColor, probe: string): number => {
  const selectors = (Array.isArray(rule.scope) ? rule.scope : [rule.scope ?? ""]).flatMap((s) =>
    s.split(","),
  );
  let best = -1;
  for (const raw of selectors) {
    const parts = raw.trim().split(/\s+/);
    // A probe is a single scope, so a selector naming ancestors never matches.
    if (parts.length !== 1 || !parts[0]) continue;
    const name = parts[0];
    if (probe === name || probe.startsWith(`${name}.`))
      best = Math.max(best, 0x10000 + name.length);
  }
  return best;
};

const fontStyle = (value: string): SemanticStyle => ({
  italic: /italic/.test(value),
  bold: /bold/.test(value),
});

/** colorThemeData.resolveScopes: the first probe scope any rule styles wins. */
const resolveScopes = (tokenColors: TokenColor[], probes: string[]): SemanticStyle | undefined => {
  for (const probe of probes) {
    let foreground: string | undefined;
    let font: string | undefined;
    let foregroundScore = -1;
    let fontScore = -1;
    for (const rule of tokenColors) {
      const score = ruleScore(rule, probe);
      if (score < 0) continue;
      if (score >= foregroundScore && rule.settings.foreground) {
        foreground = rule.settings.foreground;
        foregroundScore = score;
      }
      if (score >= fontScore && typeof rule.settings.fontStyle === "string") {
        font = rule.settings.fontStyle;
        fontScore = score;
      }
    }
    if (foreground !== undefined || font !== undefined) {
      return { foreground, ...(font === undefined ? {} : fontStyle(font)) };
    }
  }
  return undefined;
};

/**
 * The style VS Code applies to a semantic token, or undefined when the
 * TextMate colour stays (colorThemeData.getTokenStyle).
 */
export const resolveSemanticStyle = (
  theme: VSCodeTheme,
  legend: SemanticLegend,
  type: string,
  modifiers: string[],
): SemanticStyle | undefined => {
  const result: SemanticStyle = {};
  const score = { foreground: -1, italic: -1, bold: -1 };
  const take = (matchScore: number, style: SemanticStyle) => {
    if (style.foreground && score.foreground <= matchScore) {
      score.foreground = matchScore;
      result.foreground = style.foreground;
    }
    for (const key of ["italic", "bold"] as const) {
      if (style[key] !== undefined && score[key] <= matchScore) {
        score[key] = matchScore;
        result[key] = style[key];
      }
    }
  };

  for (const [selector, value] of Object.entries(theme.semanticTokenColors ?? {})) {
    const s = selectorScore(parseSelector(selector), type, modifiers, legend);
    if (s < 0) continue;
    if (typeof value === "string") take(s, { foreground: value });
    else
      take(s, {
        foreground: value.foreground,
        ...(value.fontStyle === undefined ? {} : fontStyle(value.fontStyle)),
      });
  }

  // Properties the theme set can no longer be replaced by a fallback.
  const fallbackNeeded = Object.values(score).some((v) => v === -1);
  for (const key of Object.keys(score) as (keyof typeof score)[]) {
    if (score[key] !== -1) score[key] = Number.MAX_VALUE;
  }
  if (fallbackNeeded) {
    const defaults: [Selector, string[]][] = [
      ...STANDARD_SCOPES.map(([s, scopes]): [Selector, string[]] => [parseSelector(s), scopes]),
      ...Object.entries(legend.scopes).map(([s, scopes]): [Selector, string[]] => [
        parseSelector(s, legend.language),
        scopes,
      ]),
    ];
    for (const [selector, probes] of defaults) {
      const s = selectorScore(selector, type, modifiers, legend);
      if (s < 0) continue;
      const style = resolveScopes(theme.tokenColors, probes);
      if (style) take(s, style);
    }
  }

  const styled =
    result.foreground !== undefined || result.italic !== undefined || result.bold !== undefined;
  return styled ? result : undefined;
};

export type SemanticToken = {
  line: number;
  character: number;
  length: number;
  type: string;
  modifiers: string[];
};

/** A piece of code as the TextMate grammar colours it. */
export type TextMatePiece = {
  line: number;
  character: number;
  text: string;
  foreground: string;
  italic: boolean;
  scope: string;
  /** Every scope, outermost first, where known. */
  scopes?: string[];
};

export type SemanticDifference = {
  token: SemanticToken;
  text: string;
  semantic: SemanticStyle;
  textMate: TextMatePiece;
};

const same = (a?: string, b?: string) => a?.toUpperCase() === b?.toUpperCase();

/**
 * Every place where semantic highlighting would show a different colour or
 * italics from the TextMate grammar alone.
 */
export const semanticDifferences = (
  theme: VSCodeTheme,
  legend: SemanticLegend,
  tokens: SemanticToken[],
  pieces: TextMatePiece[],
): SemanticDifference[] => {
  const differences: SemanticDifference[] = [];
  for (const token of tokens) {
    const style = resolveSemanticStyle(theme, legend, token.type, token.modifiers);
    if (!style) continue;
    const end = token.character + token.length;
    const covered = pieces.filter(
      (p) =>
        p.line === token.line && p.character < end && p.character + p.text.length > token.character,
    );
    for (const piece of covered) {
      if (!piece.text.trim()) continue;
      const colour = style.foreground !== undefined && !same(style.foreground, piece.foreground);
      const italic = style.italic !== undefined && style.italic !== piece.italic;
      if (colour || italic) {
        const first = covered[0] ?? piece;
        const text = covered
          .map((p) => p.text)
          .join("")
          .slice(token.character - first.character, end - first.character);
        differences.push({ token, text, semantic: style, textMate: piece });
        break;
      }
    }
  }
  return differences;
};

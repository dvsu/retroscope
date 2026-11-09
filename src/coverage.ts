// Language coverage: which pieces of real code no theme rule colours.
//
// Each file in demo/ is tokenised with Shiki, which runs TextMate grammars
// and matches theme rules the way VS Code does. A piece of code is
// "uncovered" when only a catch-all rule colours it: one whose scope is a bare
// root such as `source` (every piece of code in a file). The editor then draws
// it in that catch-all colour, or the default text colour if there is none,
// whatever it is: a keyword, a type or a variable. A specific rule that
// deliberately picks the default colour still counts as covered.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type BundledLanguage,
  bundledLanguages,
  createHighlighter,
  type ThemeRegistrationRaw,
} from "shiki";
import type { VSCodeTheme } from "./types";

/** Root scopes: a rule matching only these colours everything, so it says nothing about a piece. */
export const CATCH_ALL_SCOPES = new Set(["source", "text"]);

const isSpecific = (rule: { scope?: string | string[] }): boolean =>
  [rule.scope ?? []].flat().some((scope) => !CATCH_ALL_SCOPES.has(scope.trim()));

export const DEMO_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../demo");

/** Shiki language of each demo file, by extension (or full name). */
const LANGUAGES: Record<string, string> = {
  Dockerfile: "docker",
  c: "c",
  cpp: "cpp",
  cs: "csharp",
  css: "css",
  dart: "dart",
  go: "go",
  html: "html",
  java: "java",
  js: "javascript",
  json: "json",
  kt: "kotlin",
  lua: "lua",
  md: "markdown",
  php: "php",
  py: "python",
  rb: "ruby",
  rs: "rust",
  scss: "scss",
  sh: "shellscript",
  sql: "sql",
  swift: "swift",
  toml: "toml",
  ts: "typescript",
  tsx: "tsx",
  yaml: "yaml",
};

/** Display name of each demo language, as the README lists it. */
export const LANGUAGE_NAMES: Record<string, string> = {
  c: "C",
  cpp: "C++",
  csharp: "C#",
  css: "CSS",
  dart: "Dart",
  docker: "Dockerfile",
  go: "Go",
  html: "HTML",
  java: "Java",
  javascript: "JavaScript",
  json: "JSON",
  kotlin: "Kotlin",
  lua: "Lua",
  markdown: "Markdown",
  php: "PHP",
  python: "Python",
  ruby: "Ruby",
  rust: "Rust",
  scss: "SCSS",
  shellscript: "Shell",
  sql: "SQL",
  swift: "Swift",
  toml: "TOML",
  tsx: "TSX",
  typescript: "TypeScript",
  yaml: "YAML",
};

/**
 * Why a piece is uncovered:
 * - "unstyled": the grammar labels it (say `support.function.sql`) but no rule
 *   matches the label. The theme can and should fix these.
 * - "unlabelled": the grammar gives it nothing more specific than the file's
 *   root or a `meta.*` region, so no rule can target it; it takes the
 *   catch-all colour.
 */
export type UncoveredKind = "unstyled" | "unlabelled";

export type Uncovered = { scope: string; kind: UncoveredKind; count: number; examples: string[] };

export const kindOf = (scope: string): UncoveredKind =>
  /^(source|text|meta)(\.|$)/.test(scope) ? "unlabelled" : "unstyled";

export type LanguageCoverage = {
  lang: string;
  file: string;
  /** Non-blank pieces of code in the sample. */
  pieces: number;
  /** Pieces only a catch-all rule colours. */
  uncovered: number;
  /** Of those, pieces the grammar labels but no rule matches. */
  unstyled: number;
  /** Uncovered pieces grouped by their innermost scope, most frequent first. */
  byScope: Uncovered[];
};

/** Every demo file with its language; a file of unknown language is an error. */
export const sampleFiles = (): { lang: string; file: string }[] =>
  fs
    .readdirSync(DEMO_DIR)
    .filter((file) => !file.startsWith("."))
    .sort()
    .map((file) => {
      const lang = LANGUAGES[file] ?? LANGUAGES[file.slice(file.lastIndexOf(".") + 1)];
      if (!lang) throw new Error(`demo/${file}: add its language to LANGUAGES in src/coverage.ts`);
      return { lang, file };
    });

export const measureCoverage = async (theme: VSCodeTheme): Promise<LanguageCoverage[]> => {
  const samples = sampleFiles();
  const highlighter = await createHighlighter({
    themes: [{ ...theme, name: "under-test" } as ThemeRegistrationRaw],
    langs: samples.map((s) => s.lang as BundledLanguage),
  });
  try {
    return samples.map(({ lang, file }) => {
      const code = fs.readFileSync(path.join(DEMO_DIR, file), "utf8");
      const { tokens } = highlighter.codeToTokens(code, {
        lang: lang as BundledLanguage,
        theme: "under-test",
        includeExplanation: true,
      });
      const groups = new Map<string, Uncovered>();
      let pieces = 0;
      let uncovered = 0;
      let unstyled = 0;
      for (const token of tokens.flat()) {
        for (const part of token.explanation ?? []) {
          const text = part.content.trim();
          if (!text) continue;
          pieces++;
          if (part.scopes.some((s) => s.themeMatches?.some(isSpecific))) continue;
          uncovered++;
          const scope = part.scopes[part.scopes.length - 1]?.scopeName ?? "(none)";
          const kind = kindOf(scope);
          if (kind === "unstyled") unstyled++;
          const group: Uncovered = groups.get(scope) ?? { scope, kind, count: 0, examples: [] };
          group.count++;
          if (group.examples.length < 3 && !group.examples.includes(text))
            group.examples.push(text);
          groups.set(scope, group);
        }
      }
      const byScope = [...groups.values()].sort((a, b) => b.count - a.count);
      return { lang, file, pieces, uncovered, unstyled, byScope };
    });
  } finally {
    highlighter.dispose();
  }
};

/**
 * Reviewed grammar labels that need no rule of their own, and why. They wrap
 * a whole region, like `meta.*`, and every token inside has its own label.
 */
export const UNRULED_LABELS: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /^(new|switch-statement|switch-block|switch-expression|case-clause)\.expr\./,
    reason: "JavaScript and TypeScript label whole expressions, not tokens.",
  },
  {
    pattern: /^everything\.else\.c$/,
    reason: "C labels the rest of a member-access line with it; the tokens keep their colour.",
  },
  {
    pattern: /^support\.other\.php$/,
    reason: "PHP's only use is a goto target; a rule on bare support.other would be too broad.",
  },
];

/** Every name in a grammar, each a list of the scopes one token gets together. */
const grammarNames = (node: unknown, out: string[][]): string[][] => {
  if (Array.isArray(node)) {
    for (const item of node) grammarNames(item, out);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if ((key === "name" || key === "contentName") && typeof value === "string") {
        // Names built from captures, like `$1`, are only known at run time.
        const scopes = value.split(/\s+/).filter((s) => s && !s.includes("$"));
        if (scopes.length) out.push(scopes);
      } else {
        grammarNames(value, out);
      }
    }
  }
  return out;
};

/** Labels each demo language's grammar can produce that no rule matches. */
export const unruledLabels = async (
  theme: VSCodeTheme,
): Promise<{ lang: string; labels: string[] }[]> => {
  // A selector matches a label it equals or that starts with it plus a dot;
  // for a descendant selector like `source.python keyword` the last part does.
  const selectors = theme.tokenColors
    .filter(isSpecific)
    .flatMap((rule) => [rule.scope ?? []].flat())
    .flatMap((scope) => scope.split(","))
    .map((scope) => scope.trim().split(/\s+/).pop() ?? "")
    .filter((scope) => scope && !CATCH_ALL_SCOPES.has(scope));
  const hasRule = (label: string) =>
    selectors.some((s) => label === s || label.startsWith(`${s}.`)) ||
    kindOf(label) === "unlabelled" ||
    UNRULED_LABELS.some(({ pattern }) => pattern.test(label));

  const results: { lang: string; labels: string[] }[] = [];
  for (const { lang } of sampleFiles()) {
    const grammars = (await bundledLanguages[lang as BundledLanguage]()).default;
    // The last grammar is the language's own; the others are languages it embeds.
    const { name: _displayName, ...own } = grammars[grammars.length - 1] ?? {};
    const missing = new Set<string>();
    for (const scopes of grammarNames(own, [])) {
      if (!scopes.some(hasRule)) missing.add(scopes.join(" "));
    }
    results.push({ lang, labels: [...missing].sort() });
  }
  return results;
};

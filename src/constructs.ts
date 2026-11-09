// Keywords and symbols look the same in every language as in TypeScript:
// `this` and `=` in the keyword colour, `.` and `,` muted, `fun` like
// `function`, and so on. The test reads each demo file the way an editor
// colours it, with each grammar editors use for that language.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { BundledLanguage } from "shiki";
import { loadRecording } from "./editor-grammars";
import type { TextMatePiece } from "./semantic";
import { textMatePieces } from "./semantic-fixture";
import { colourRecording } from "./textmate";
import type { EditorColor } from "./themes/types";
import type { VSCodeTheme } from "./types";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export type Role =
  | "keyword"
  | "punctuation"
  | "typeAnnotation"
  | "brightYellow"
  | "boolean"
  | "nullable"
  | "type";

const words = (role: Role, list: string): [string, Role][] =>
  list
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => [w, role]);

/** The colour each keyword or symbol has in TypeScript. Brackets are left out: editors draw them in nesting colours. */
export const ROLES: Record<string, Role> = Object.fromEntries([
  ...words(
    "keyword",
    `this super new return if else for while do switch case default when try catch finally throw
     throws class interface enum record object data sealed companion val var let const static final
     public private protected internal abstract override open await in is as instanceof typeof
     import package export extends implements typealias operator inline reified break continue
     synchronized readonly namespace using out where
     = == === != !== >= <= && || ! + - * % += -= ++ -- ?? ?: -> => .. ... ? & |`,
  ),
  ...words("punctuation", ". , ; ?. \" ' ${ ` @ # $ ::"),
  ...words("typeAnnotation", ":"),
  ...words("brightYellow", "function fun async suspend"),
  ...words("boolean", "true false"),
  ...words("nullable", "null undefined"),
  ...words("type", "void"),
]);

/** Per language: roles that differ from TypeScript's by design, and words used there as names. */
export const LANGUAGE_ROLES: Record<string, { roles?: Record<string, Role>; names?: string[] }> = {
  typescript: { names: ["record", "sealed", "get", "set"], roles: {} },
  csharp: { roles: { ":": "punctuation" }, names: ["get", "set"] },
  java: { roles: { ":": "keyword", "::": "keyword" }, names: ["function", "get"] },
  // Neither Kotlin grammar can tell fun from val or package, so fun takes the keyword colour.
  kotlin: { roles: { fun: "keyword" }, names: ["let", "get", "set"] },
};

/** Each grammar editors use, by language. */
export const RENDERINGS: {
  id: string;
  language: string;
  demo: string;
  grammar: "bundled" | string;
}[] = [
  { id: "typescript", language: "typescript", demo: "demo/demo.ts", grammar: "bundled" },
  { id: "csharp", language: "csharp", demo: "demo/demo.cs", grammar: "bundled" },
  { id: "java", language: "java", demo: "demo/demo.java", grammar: "bundled" },
  { id: "java-redhat", language: "java", demo: "demo/demo.java", grammar: "java-redhat" },
  {
    id: "kotlin-mathiasfrohlich",
    language: "kotlin",
    demo: "demo/demo.kt",
    grammar: "kotlin-mathiasfrohlich",
  },
  { id: "kotlin-jetbrains", language: "kotlin", demo: "demo/demo.kt", grammar: "kotlin-jetbrains" },
];

/**
 * Where a grammar gives one label to things TypeScript colours apart, so the
 * theme cannot follow TypeScript there. Each names the rendering, the
 * keywords or symbols, and why.
 */
export const GRAMMAR_LIMITS: { rendering: string; lexemes: string[]; why: string }[] = [
  {
    rendering: "typescript",
    lexemes: [":", "null", "undefined"],
    why: "the reference: a colon starts a type, a case or an object key, and null can be a type",
  },
  {
    rendering: "csharp",
    lexemes: [":"],
    why: "the grammar reads the colon of a format such as {total:C} as the ?: operator",
  },
  ...["java", "java-redhat"].map((rendering) => ({
    rendering,
    lexemes: ["null"],
    why: "true, false and null share one label",
  })),
  {
    rendering: "kotlin-jetbrains",
    lexemes: ["=", "!=", ">=", "&&", "!", "+=", "->", "?:", "?", ":"],
    why: "every operator and symbol shares one label with `.`, which stays muted",
  },
  {
    rendering: "kotlin-jetbrains",
    lexemes: ["suspend", "null", "$", "${", "'", "class", ",", "out"],
    why: "suspend shares a label with private, null with true; commas, variance and template and character pieces are unlabelled",
  },
  {
    rendering: "kotlin-mathiasfrohlich",
    lexemes: ["null", "class", "suspend", "@", "'", "in", ".", ">=", "!="],
    why: "null and ::class share a label with true, suspend with private, and >= and != with the angle brackets of generics; @ and the dots of package paths and extension receivers are part of the names; a top-level in shares the symbols' label",
  },
];

const LEXEMES =
  /\.\.\.|\$\{|->|=>|\?\.|\?:|\?\?|::|\.\.|===|!==|==|!=|>=|<=|&&|\|\||\+=|-=|\+\+|--|[A-Za-z_][A-Za-z0-9_]*|\d[\w.]*|\S/g;

/** Every keyword and symbol in a rendering with the colour it is drawn in. */
export const lexemeColours = async (
  rendering: (typeof RENDERINGS)[number],
  theme: VSCodeTheme,
): Promise<{ lexeme: string; line: number; colour: string }[]> => {
  const source = fs.readFileSync(path.join(root, rendering.demo), "utf8");
  const pieces: TextMatePiece[] =
    rendering.grammar === "bundled"
      ? await textMatePieces(theme, source, rendering.language as BundledLanguage)
      : colourRecording(theme, loadRecording(rendering.grammar).pieces);
  const lines = source.split("\n");
  const byLine = new Map<number, TextMatePiece[]>();
  for (const p of pieces) byLine.set(p.line, [...(byLine.get(p.line) ?? []), p]);
  const found: { lexeme: string; line: number; colour: string }[] = [];
  lines.forEach((text, line) => {
    for (const match of text.matchAll(LEXEMES)) {
      const at = match.index ?? 0;
      const piece = byLine
        .get(line)
        ?.find((p) => p.character <= at && at < p.character + p.text.length);
      if (!piece) continue;
      // Words and symbols in comments and string text are prose, and a symbol
      // that is part of a name (`operator +`) is a name.
      if (piece.scopes?.some((s) => s.startsWith("comment"))) continue;
      if (/^(string|entity\.name)/.test(piece.scope)) continue;
      found.push({ lexeme: match[0], line, colour: piece.foreground });
    }
  });
  return found;
};

export const roleColour = (colors: EditorColor, role: Role): string => colors[role];

/** The role a keyword or symbol should have in a language, if it is one we check. */
export const roleOf = (language: string, lexeme: string): Role | undefined => {
  const spec = LANGUAGE_ROLES[language] ?? {};
  if (spec.names?.includes(lexeme)) return undefined;
  // Plain objects also answer for inherited names such as toString.
  const role: unknown = spec.roles?.[lexeme] ?? ROLES[lexeme];
  return typeof role === "string" ? (role as Role) : undefined;
};

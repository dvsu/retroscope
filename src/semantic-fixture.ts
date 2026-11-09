// Compares code with semantic highlighting on and off, from recorded tokens.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type BundledLanguage, createHighlighter, type ThemeRegistrationRaw } from "shiki";
import { loadRecording } from "./editor-grammars";
import {
  OTHER_EXTENSION_SUPERTYPES,
  type SemanticDifference,
  semanticDifferences,
  type TextMatePiece,
} from "./semantic";
import { SEMANTIC_DIR, type SemanticFixture } from "./semantic-capture";
import { colourRecording } from "./textmate";
import type { VSCodeTheme } from "./types";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Languages with recorded semantic tokens. */
export const SEMANTIC_LANGUAGES = ["csharp", "java", "kotlin"] as const;

export const loadFixture = (language: string): SemanticFixture =>
  JSON.parse(fs.readFileSync(path.join(SEMANTIC_DIR, `${language}.json`), "utf8"));

/**
 * Where the server knows better than the grammar, and editors with the server
 * show its colour. Each entry names the language, the token type and the
 * TextMate scopes it corrects.
 */
export const KNOWN_MERGES: {
  language: string;
  /** Only with this grammar recording, when the server meets more than one. */
  textMate?: string;
  type: string;
  scopes: RegExp;
  why: string;
}[] = [
  {
    language: "csharp",
    type: "enum",
    scopes: /^variable\.other\.object\.cs$/,
    why: "the grammar cannot tell an enum from a variable before a dot, as in Status.Pending",
  },
  {
    language: "java",
    type: "class",
    scopes: /^(variable\.other\.object|meta\.method-call)\.java$/,
    why: "the grammar cannot tell a class from a variable before a dot or ::, as in Optional.of and System.err",
  },
  {
    language: "java",
    type: "record",
    scopes: /^meta\.method-call\.java$/,
    why: "a record named in a method reference, as in Product::sku",
  },
  {
    language: "java",
    type: "method",
    scopes: /^meta\.method-call\.java$/,
    why: "a method named in a method reference, as in rule::apply",
  },
  {
    language: "java",
    type: "class",
    scopes: /^storage\.type\.java$/,
    why: "a constructor call with type arguments, new ArrayList<>(), which the grammar reads as a type",
  },
  {
    language: "java",
    type: "namespace",
    scopes: /^storage\.type\.java$/,
    why: "the grammar reads a package in a full name such as java.util.Iterator as a type",
  },
  {
    language: "java",
    type: "typeParameter",
    scopes: /^variable\.parameter\.java$/,
    why: "a type parameter named in a doc comment, @param <T>",
  },
  {
    language: "java",
    type: "class",
    scopes: /^storage\.type\.local\.java$/,
    why: "the server labels var with the type it stands for, so var takes the type colour",
  },
  {
    language: "kotlin",
    textMate: "kotlin-jetbrains",
    type: "*",
    scopes: /^(source|variable\.other\.interpolated\.expression)\.kotlin$/,
    why: "JetBrains' grammar leaves names unlabelled and its server colours them",
  },
  {
    language: "kotlin",
    type: "class",
    scopes: /^(storage\.type|variable\.language)\.kotlin$/,
    why: "the server labels this with its class, so this takes the type colour",
  },
  // JetBrains' server with mathiasfrohlich's grammar, when both extensions are installed.
  {
    language: "kotlin",
    textMate: "kotlin-mathiasfrohlich",
    type: "*",
    scopes:
      /^(source|meta\.class|meta\.block|variable\.parameter\.function|entity\.name\.function|entity\.string\.template\.element)\.kotlin$/,
    why: "the grammar leaves some names unlabelled or guesses them (an object, a reified type, a call in a template); the server knows",
  },
  {
    language: "kotlin",
    textMate: "kotlin-mathiasfrohlich",
    type: "method",
    scopes: /^keyword\.operator\.bitwise\.kotlin$/,
    why: "and, or and xor are infix functions in Kotlin",
  },
];

/** Grammars each server is checked against: the one its editor uses, and others it may meet. */
export const SEMANTIC_PAIRINGS: { language: string; textMate: string }[] = [
  { language: "csharp", textMate: "bundled" },
  { language: "java", textMate: "java-redhat" },
  { language: "kotlin", textMate: "kotlin-jetbrains" },
  { language: "kotlin", textMate: "kotlin-mathiasfrohlich" },
];

/** Code coloured by the grammar the tests bundle. */
export const textMatePieces = async (
  theme: VSCodeTheme,
  source: string,
  lang: BundledLanguage,
): Promise<TextMatePiece[]> => {
  const highlighter = await createHighlighter({
    themes: [{ ...theme, name: "under-test" } as ThemeRegistrationRaw],
    langs: [lang],
  });
  try {
    const { tokens } = highlighter.codeToTokens(source, {
      lang,
      theme: "under-test",
      includeExplanation: true,
    });
    const lineStarts = [0];
    for (let i = 0; i < source.length; i++) if (source[i] === "\n") lineStarts.push(i + 1);
    const pieces: TextMatePiece[] = [];
    tokens.forEach((line, lineNumber) => {
      for (const token of line) {
        // Shiki counts offsets from the start of the file.
        let character = token.offset - (lineStarts[lineNumber] ?? 0);
        for (const part of token.explanation ?? []) {
          pieces.push({
            line: lineNumber,
            character,
            text: part.content,
            foreground: token.color ?? theme.colors["editor.foreground"] ?? "",
            italic: ((token.fontStyle ?? 0) & 1) === 1,
            scope: part.scopes[part.scopes.length - 1]?.scopeName ?? "",
            scopes: part.scopes.map((x) => x.scopeName),
          });
          character += part.content.length;
        }
      }
    });
    return pieces;
  } finally {
    highlighter.dispose();
  }
};

/**
 * Every token whose colour changes when semantic highlighting comes on. With
 * otherExtensions, the language is resolved as in an editor that also has
 * popular extensions for other languages installed, whose token types can
 * change which fallback a token finds.
 */
export const semanticDifferencesFor = async (
  language: string,
  theme: VSCodeTheme,
  otherExtensions = false,
  grammar?: string,
): Promise<{ differences: SemanticDifference[]; allowed: SemanticDifference[] }> => {
  const fixture = loadFixture(language);
  const textMate = grammar ?? fixture.textMate;
  const source = fs.readFileSync(path.join(root, fixture.source), "utf8");
  const pieces =
    textMate === "bundled"
      ? await textMatePieces(theme, source, language as BundledLanguage)
      : colourRecording(theme, loadRecording(textMate).pieces);
  const legend = otherExtensions
    ? {
        ...fixture.legend,
        superTypes: { ...OTHER_EXTENSION_SUPERTYPES, ...fixture.legend.superTypes },
      }
    : fixture.legend;
  const all = semanticDifferences(theme, legend, fixture.tokens, pieces);
  const known = (d: SemanticDifference) =>
    KNOWN_MERGES.some(
      (m) =>
        m.language === language &&
        (m.textMate === undefined || m.textMate === textMate) &&
        (m.type === "*" || m.type === d.token.type) &&
        m.scopes.test(d.textMate.scope),
    );
  return { differences: all.filter((d) => !known(d)), allowed: all.filter(known) };
};

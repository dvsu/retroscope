import type { EditorColor } from "../themes/types";
import type { TokenColor } from "../types";

// C# follows the TypeScript colours: keywords and operators in the keyword
// colour, built-in and named types in the type colour, `async` like other
// function keywords, and punctuation (including `.` and `?.`) muted.
//
// Every selector starts with `source.cs`, so these rules only touch C#, and
// VS Code cannot borrow them when it colours the C# server's coarse semantic
// tokens (see textMateOnly in src/semantic.ts). With semantic highlighting on
// or off, these keywords, operators and literals keep the same colours.
const cs = (...scopes: string[]) => scopes.map((s) => `source.cs ${s}`);

export const generate = (colors: EditorColor): TokenColor[] => [
  {
    name: "[csharp] Keywords, modifiers and operators",
    scope: cs(
      "storage.modifier",
      "storage.type",
      "keyword.control",
      "keyword.other",
      "keyword.operator",
      "keyword.preprocessor",
      "variable.language.this",
      // The ? of a nullable type, like TypeScript's optional ?
      "punctuation.separator.question-mark",
    ),
    settings: {
      foreground: colors.keyword,
    },
  },
  {
    name: "[csharp] Function keywords",
    scope: cs("storage.modifier.async"),
    settings: {
      foreground: colors.brightYellow,
    },
  },
  {
    name: "[csharp] Built-in and named types",
    scope: cs("keyword.type", "entity.name.type"),
    settings: {
      foreground: colors.type,
    },
  },
  {
    name: "[csharp] Namespaces",
    scope: cs("entity.name.type.namespace"),
    settings: {
      foreground: colors.variable,
    },
  },
  {
    name: "[csharp] Null",
    scope: cs("constant.language.null"),
    settings: {
      foreground: colors.nullable,
    },
  },
  {
    name: "[csharp] Punctuation: member access and null-conditional access",
    scope: cs("keyword.operator.null-conditional", "punctuation.accessor"),
    settings: {
      foreground: colors.punctuation,
    },
  },
];

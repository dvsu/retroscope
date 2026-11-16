import type { EditorColor } from "../themes/types";
import type { TokenColor } from "../types";

// C# follows VS Code's Dark 2026 grouping in Retroscope's palette:
// - modifiers, declaration/type keywords, built-in types, word operators,
//   booleans, null, this and discard in the keyword colour;
// - control-flow keywords (including `await`) in bright purple;
// - symbolic operators muted alongside punctuation;
// - named types and namespaces in the type colour;
// - parameters in bright yellow, fields in bright blue, enum members in blue;
// - XML doc comment tags, attributes and inner text in the comment colour.
//
// Every selector starts with `source.cs`, so these rules only touch C#, and
// VS Code cannot borrow them when it colours Roslyn's coarse semantic tokens
// (see textMateOnly in src/semantic.ts).
const cs = (...scopes: string[]) => scopes.map((s) => `source.cs ${s}`);

export const generate = (colors: EditorColor): TokenColor[] => [
  {
    name: "[csharp] Keywords, modifiers and built-in types",
    scope: cs(
      "storage.modifier",
      "storage.modifier.async",
      "storage.type",
      "keyword.type",
      "keyword.other",
      "keyword.preprocessor",
      "keyword.operator.expression",
      "variable.language",
      "constant.language.boolean",
      "constant.language.null",
    ),
    settings: {
      foreground: colors.keyword,
    },
  },
  {
    name: "[csharp] Control keywords",
    scope: cs("keyword.control", "keyword.operator.expression.await"),
    settings: {
      foreground: colors.brightPurple,
    },
  },
  {
    name: "[csharp] Punctuation and symbolic operators",
    scope: cs("keyword.operator", "punctuation.accessor", "punctuation.separator.question-mark"),
    settings: {
      foreground: colors.punctuation,
    },
  },
  {
    name: "[csharp] Named types and namespaces",
    scope: cs("entity.name.type"),
    settings: {
      foreground: colors.type,
    },
  },
  {
    name: "[csharp] Parameters",
    scope: cs("entity.name.variable.parameter"),
    settings: {
      foreground: colors.brightYellow,
    },
  },
  {
    name: "[csharp] Fields",
    scope: cs("entity.name.variable.field"),
    settings: {
      foreground: colors.brightBlue,
    },
  },
  {
    name: "[csharp] Enum members",
    scope: cs("entity.name.variable.enum-member"),
    settings: {
      foreground: colors.blue,
    },
  },
  {
    name: "[csharp] XML doc comments",
    scope: cs(
      "comment.block.documentation.cs",
      "comment.block.documentation.cs punctuation",
      "comment.block.documentation.cs meta.tag.cs",
      "comment.block.documentation.cs entity.name.tag",
      "comment.block.documentation.cs entity.other.attribute-name",
      "comment.block.documentation.cs string.quoted.double.cs",
    ),
    settings: {
      foreground: colors.comment,
    },
  },
];

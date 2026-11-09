import type { EditorColor } from "../themes/types";
import type { TokenColor } from "../types";

// Kotlin follows the TypeScript colours, as far as the two grammars editors
// use allow; where only one of them can, both are kept alike instead. The
// rules cover:
// - the Kotlin extension by mathiasfrohlich (also what VS Code and Cursor
//   users mostly have), which labels most operators and punctuation apart;
// - JetBrains' Kotlin extension, whose small grammar gives every operator
//   and symbol, `.` and `:` included, the one label `keyword.operator.kotlin`,
//   and leaves brackets, commas and numbers unlabelled. Its language server
//   colours the names.
// Every selector starts with `source.kotlin`, so these rules only touch Kotlin.
const kt = (...scopes: string[]) => scopes.map((s) => `source.kotlin ${s}`);

export const generate = (colors: EditorColor): TokenColor[] => [
  {
    name: "[kotlin] Package and import paths",
    scope: kt("meta.package", "meta.import", "entity.name.package", "storage.modifier.import"),
    settings: {
      foreground: colors.variable,
    },
  },
  {
    name: "[kotlin] Keywords, modifiers and operators",
    scope: kt(
      "storage.type",
      "storage.modifier",
      "keyword.control",
      "keyword.hard",
      "keyword.soft",
      "keyword.operator",
      "variable.language.this",
      "variable.language",
      // fun and package: mathiasfrohlich's grammar labels them alike, and
      // JetBrains' gives fun the label of val and class, so both editors
      // agree only with fun in the keyword colour.
      "keyword.hard.fun",
      "keyword.other.kotlin",
      "storage.modifier.coroutine",
    ),
    settings: {
      foreground: colors.keyword,
    },
  },
  {
    name: "[kotlin] Type annotation colons",
    scope: kt("keyword.operator.declaration"),
    settings: {
      foreground: colors.typeAnnotation,
    },
  },
  {
    // JetBrains' grammar labels every symbol keyword.operator.kotlin, so `.`
    // and `=` cannot differ there. Dots, colons and generics are the most
    // common, so they take the muted colour, as in TypeScript.
    name: "[kotlin] Punctuation: symbols in JetBrains' grammar, accessors",
    scope: kt(
      "keyword.operator.kotlin",
      // mathiasfrohlich's grammar labels generic <T> like the >= operator.
      "keyword.operator.comparison",
      "punctuation.accessor",
      "punctuation.seperator",
      "punctuation.separator",
      "punctuation.terminator",
      "punctuation.section",
      "punctuation.definition.template-expression",
      "keyword.operator.dereference",
    ),
    settings: {
      foreground: colors.punctuation,
    },
  },
  {
    // mathiasfrohlich's grammar gives `in` and `is` the same label as
    // JetBrains' symbols; only it wraps code in block and group regions.
    name: "[kotlin] Keyword operators in blocks: in, is",
    scope: kt(
      "meta.block.kotlin keyword.operator.kotlin",
      "meta.group.kotlin keyword.operator.kotlin",
    ),
    settings: {
      foreground: colors.keyword,
    },
  },
  {
    // Like a TypeScript decorator.
    name: "[kotlin] Annotations",
    scope: kt("storage.type.annotation", "meta.annotation entity.name", "meta.annotation"),
    settings: {
      foreground: colors.function,
    },
  },
  {
    name: "[kotlin] Template expressions",
    scope: kt(
      "entity.string.template.element",
      "meta.template.expression",
      "variable.other.interpolated",
    ),
    settings: {
      foreground: colors.variable,
    },
  },
  {
    name: "[kotlin] Functions and calls",
    scope: kt("entity.name.function", "support.function"),
    settings: {
      foreground: colors.function,
    },
  },
  {
    // JetBrains' grammar cannot mark /** as punctuation, and
    // mathiasfrohlich's splits it into /* and *, so comment marks take the
    // comment colour in Kotlin.
    name: "[kotlin] Comment marks",
    scope: kt("punctuation.definition.comment"),
    settings: {
      foreground: colors.comment,
    },
  },
  {
    name: "[kotlin] Null",
    scope: kt("constant.language.null"),
    settings: {
      foreground: colors.nullable,
    },
  },
];

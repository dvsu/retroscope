import type { EditorColor } from "../themes/types";
import type { TokenColor } from "../types";

export const generate = (colors: EditorColor): TokenColor[] => {
  // General rules, keyed on standard TextMate scope names, so a language
  // without its own file in src/languages still gets sensible colours. Each
  // reuses the colour the language-specific files give the same kind of thing.
  return [
    {
      name: "[default] Comment",
      scope: ["comment"],
      settings: {
        foreground: colors.comment,
        fontStyle: "italic",
      },
    },
    {
      name: "[default] Comment punctuations",
      scope: ["punctuation.definition.comment"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[default] Function, method, decorator",
      scope: ["entity.name.function", "entity.name.operator"],
      settings: {
        foreground: colors.function,
      },
    },
    {
      name: "[default] Keywords",
      scope: ["keyword", "support.other.directive"],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[default] Keywords: function, async, storage modifier",
      scope: ["storage.type.function", "keyword.other.fn", "storage.modifier"],
      settings: {
        foreground: colors.brightYellow,
      },
    },
    {
      name: "[default] Misc",
      scope: ["source"],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      name: "[default] Punctuations",
      scope: ["punctuation"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[default] Type definition",
      scope: ["entity.name.type", "support.type"],
      settings: {
        foreground: colors.type,
      },
    },
    {
      name: "[default] Value: boolean",
      scope: ["constant.language"],
      settings: {
        foreground: colors.boolean,
      },
    },
    {
      name: "[default] Value: number",
      scope: ["constant.numeric", "constant.numeric"],
      settings: {
        foreground: colors.number,
      },
    },
    {
      name: "[default] Value: string",
      scope: ["string"],
      settings: {
        foreground: colors.string,
      },
    },
    {
      name: "[default] Variable names",
      scope: ["constant.other", "variable"],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      name: "[default] Keywords: storage type",
      scope: ["storage.type"],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[default] Type definition: built-in and named types",
      scope: [
        "storage.type.primitive",
        "storage.type.built-in",
        "storage.type.generic",
        "storage.type.java",
        "storage.type.sql",
        "support.class",
        "entity.name.namespace",
        "entity.name.module",
        "entity.name.namespace-prefix",
        "entity.other.namespace-prefix",
        "entity.other.alias",
        "entity.name.scope-resolution",
        "entity.name.package",
        "support.other.namespace",
        "entity.name.class",
        "entity.other.inherited-class",
      ],
      settings: {
        foreground: colors.type,
      },
    },
    {
      name: "[default] Built-in functions",
      scope: ["support.function"],
      settings: {
        foreground: colors.function,
      },
    },
    {
      name: "[default] Built-in variables",
      scope: ["support.variable"],
      settings: {
        foreground: colors.purple,
      },
    },
    {
      name: "[default] Built-in constants",
      scope: ["support.constant"],
      settings: {
        foreground: colors.boolean,
      },
    },
    {
      name: "[default] Attributes and selectors",
      scope: ["entity.other.attribute-name", "support.attribute", "support.other.attribute"],
      settings: {
        foreground: colors.typeAnnotation,
      },
    },
    {
      name: "[default] Tags and sections",
      scope: ["entity.name.tag", "entity.name.section"],
      settings: {
        foreground: colors.type,
      },
    },
    {
      name: "[default] Variable names: declared, fields",
      scope: ["entity.name.variable", "entity.other.attribute"],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      name: "[default] Object key",
      scope: ["meta.object-literal.key"],
      settings: {
        foreground: colors.foreground,
      },
    },
    {
      name: "[default] Braces",
      scope: ["meta.brace"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[default] Value: escape and entity characters",
      scope: ["constant.character", "support.other.escape"],
      settings: {
        foreground: colors.blue,
      },
    },
    {
      name: "[default] Constants: enum cases, labels, macros",
      scope: [
        "constant.enum",
        "entity.name.label",
        "entity.name.goto-label",
        "entity.name.other.preprocessor",
      ],
      settings: {
        foreground: colors.boolean,
      },
    },
    {
      name: "[default] Shell commands",
      scope: ["entity.name.command"],
      settings: {
        foreground: colors.function,
      },
    },
    {
      name: "[default] Value: CSS keyframe offset",
      scope: ["entity.other.keyframe-offset"],
      settings: {
        foreground: colors.number,
      },
    },
    {
      name: "[default] Regular expression: anchors and wildcards",
      scope: ["support.other.match"],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[default] Regular expression: groups",
      scope: ["support.other.parenthesis"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      // Broken syntax, such as a stray character or a missing comma in JSON,
      // stands out so it is easy to spot.
      name: "[default] Invalid code",
      scope: ["invalid"],
      settings: {
        foreground: colors.red,
      },
    },
    {
      name: "[default] Deprecated code",
      scope: ["invalid.deprecated"],
      settings: {
        foreground: colors.orange,
        fontStyle: "strikethrough",
      },
    },
    {
      name: "[default] Markup: heading",
      scope: ["markup.heading"],
      settings: {
        foreground: colors.red,
      },
    },
    {
      name: "[default] Markup: heading level 2",
      scope: ["markup.heading.setext.2"],
      settings: {
        foreground: colors.brightRed,
      },
    },
    {
      name: "[default] Markup: bold",
      scope: ["markup.bold"],
      settings: {
        fontStyle: "bold",
      },
    },
    {
      name: "[default] Markup: italic",
      scope: ["markup.italic"],
      settings: {
        fontStyle: "italic",
      },
    },
    {
      name: "[default] Markup: underline",
      scope: ["markup.underline"],
      settings: {
        fontStyle: "underline",
      },
    },
    {
      name: "[default] Markup: quote",
      scope: ["markup.quote"],
      settings: {
        fontStyle: "italic",
      },
    },
    {
      name: "[default] Markup: lists and tables",
      scope: ["markup.list", "markup.table"],
      settings: {
        foreground: colors.foreground,
      },
    },
    {
      name: "[default] Markup: code",
      scope: ["markup.raw", "markup.inline.raw"],
      settings: {
        foreground: colors.green,
      },
    },
  ];
};

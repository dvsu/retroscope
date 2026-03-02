import type { TokenColor } from "../types";
import type { EditorColor } from "../themes/types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[markdown] Comment",
      scope: ["comment.block.html"],
      settings: {
        foreground: colors.comment,
        fontStyle: "italic",
      },
    },
    {
      name: "[markdown] Comment punctuations",
      scope: ["punctuation.definition.comment.html"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[markdown] Fenced code block",
      scope: ["markup.fenced_code.block.markdown"],
      settings: {
        foreground: colors.green,
      },
    },
    {
      name: "[markdown] Fenced code language",
      scope: [
        "fenced_code.block.language",
        "fenced_code.block.language.markdown",
      ],
      settings: {
        foreground: colors.purple,
      },
    },
    {
      name: "[markdown] Heading 1",
      scope: ["heading.1.markdown"],
      settings: {
        foreground: colors.red,
      },
    },
    {
      name: "[markdown] Heading 2",
      scope: ["heading.2.markdown"],
      settings: {
        foreground: colors.redBright,
      },
    },
    {
      name: "[markdown] Heading 3",
      scope: ["heading.3.markdown"],
      settings: {
        foreground: colors.orange,
      },
    },
    {
      name: "[markdown] Heading 4",
      scope: ["heading.4.markdown"],
      settings: {
        foreground: colors.orangeBright,
      },
    },
    {
      name: "[markdown] Heading 5",
      scope: ["heading.5.markdown"],
      settings: {
        foreground: colors.yellowBright,
      },
    },
    {
      name: "[markdown] Heading 6",
      scope: ["heading.6.markdown"],
      settings: {
        foreground: colors.yellow,
      },
    },
    {
      name: "[markdown] HTML attributes",
      scope: ["entity.other.attribute-name.html"],
      settings: {
        foreground: colors.primary,
      },
    },
    {
      name: "[markdown] HTML tags",
      scope: ["entity.name.tag.html"],
      settings: {
        foreground: colors.blue,
        fontStyle: "bold",
      },
    },
    {
      name: "[markdown] Link",
      scope: [
        "constant.other.reference.link.markdown",
        "markup.underline.link.image.markdown",
        "markup.underline.link.markdown",
      ],
      settings: {
        foreground: colors.blue,
      },
    },
    {
      name: "[markdown] Math",
      scope: ["meta.embedded.math.markdown"],
      settings: {
        foreground: colors.orangeBright,
      },
    },
    {
      name: "[markdown] Math characters",
      scope: ["constant.character.math.tex"],
      settings: {
        foreground: colors.string,
      },
    },
    {
      name: "[markdown] Math functions",
      scope: ["entity.name.function.math.tex"],
      settings: {
        foreground: colors.function,
      },
    },
    {
      name: "[markdown] Math keywords",
      scope: ["constant.other.general.math.tex"],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[markdown] Math numerics",
      scope: ["constant.numeric.math.tex"],
      settings: {
        foreground: colors.number,
      },
    },
    {
      name: "[markdown] Punctuations",
      scope: [
        "punctuation.definition.arguments.begin.math.tex",
        "punctuation.definition.arguments.end.math.tex",
        "punctuation.definition.begin.frontmatter",
        "punctuation.definition.bold.markdown",
        "punctuation.definition.end.frontmatter",
        "punctuation.definition.heading.markdown",
        "punctuation.definition.italic.markdown",
        "punctuation.definition.constant.begin.markdown",
        "punctuation.definition.constant.end.markdown",
        "punctuation.definition.constant.markdown",
        "punctuation.definition.constant.math.tex",
        "punctuation.definition.function.math.tex",
        "punctuation.definition.link.description.begin.markdown",
        "punctuation.definition.link.description.end.markdown",
        "punctuation.definition.link.title.begin.markdown",
        "punctuation.definition.link.title.end.markdown",
        "punctuation.definition.list.begin.markdown",
        "punctuation.definition.markdown",
        "punctuation.definition.math.begin.markdown",
        "punctuation.definition.math.end.markdown",
        "punctuation.definition.metadata.markdown",
        "punctuation.definition.quote.begin.markdown",
        "punctuation.definition.quote.end.markdown",
        "punctuation.definition.raw.markdown",
        "punctuation.definition.strikethrough.markdown",
        "punctuation.definition.string.begin.html",
        "punctuation.definition.string.begin.markdown",
        "punctuation.definition.string.end.html",
        "punctuation.definition.string.end.markdown",
        "punctuation.definition.table.markdown",
        "punctuation.definition.tag.begin.html",
        "punctuation.definition.tag.end.html",
        "punctuation.math.begin.bracket.curly",
        "punctuation.math.end.bracket.curly",
        "punctuation.math.operator.latex",
        "punctuation.separator.key-value.html",
        "punctuation.separator.table.markdown",
      ],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[markdown] Punctuations: object, array",
      scope: ["punctuation.separator.key-value.markdown"],
      settings: {
        foreground: colors.orange,
      },
    },
    {
      name: "[markdown] Text: bold",
      scope: ["markup.bold.markdown"],
      settings: {
        foreground: colors.purpleBright,
        fontStyle: "bold",
      },
    },
    {
      name: "[markdown] Text: italic",
      scope: ["markup.italic.markdown"],
      settings: {
        foreground: colors.purpleBright,
        fontStyle: "italic",
      },
    },
    {
      name: "[markdown] Text: strikethrough",
      scope: ["markup.strikethrough.markdown"],
      settings: {
        foreground: colors.purpleBright,
        fontStyle: "bold",
      },
    },
    {
      name: "[markdown] Value: escape characters",
      scope: ["constant.character.escape.markdown"],
      settings: {
        foreground: colors.blue,
      },
    },
    {
      name: "[markdown] Value: string",
      scope: [
        "markup.inline.raw.string.markdown",
        "string.other.link.description.markdown",
        "string.other.link.description.title.markdown",
        "string.other.link.title.markdown",
        "string.quoted.double.html",
      ],
      settings: {
        foreground: colors.string,
      },
    },
    {
      name: "[markdown] Variable/ property names",
      scope: ["text.html.markdown"],
      settings: {
        foreground: colors.variable,
      },
    },
  ];
};

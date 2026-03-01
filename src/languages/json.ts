import type { TokenColor } from "../types";
import type { EditorColor } from "../themes/types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[json] Comment (for jsonc)",
      scope: [
        "comment.block.documentation.json",
        "comment.line.double-slash.js",
      ],
      settings: {
        foreground: colors.comment,
        fontStyle: "italic",
      },
    },
    {
      name: "[json] Comment punctuations (for jsonc)",
      scope: ["punctuation.definition.comment.json"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[json] Punctuations",
      scope: [
        "punctuation.support.type.property-name.begin.json",
        "punctuation.support.type.property-name.end.json",
        "punctuation.separator.dictionary.key-value.json",
        "punctuation.separator.dictionary.pair.json",
        "punctuation.definition.string.begin.json",
        "punctuation.definition.string.end.json",
      ],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[json] Punctuations: object, array",
      scope: [
        "punctuation.definition.array.begin.json",
        "punctuation.definition.array.end.json",
        "punctuation.definition.dictionary.begin.json",
        "punctuation.definition.dictionary.end.json",
      ],
      settings: {
        foreground: colors.orange,
      },
    },
    {
      name: "[json] Value: boolean, null",
      scope: ["constant.language.json"],
      settings: {
        foreground: colors.nullable,
      },
    },
    {
      name: "[json] Value: escape characters",
      scope: ["constant.character.escape.json"],
      settings: {
        foreground: colors.blue,
      },
    },
    {
      name: "[json] Value: number",
      scope: ["constant.numeric.json"],
      settings: {
        foreground: colors.number,
      },
    },
    {
      name: "[json] Value: string",
      scope: ["string.quoted.double.json"],
      settings: {
        foreground: colors.string,
      },
    },
    {
      name: "[json] Variable/ property names",
      scope: ["support.type.property-name.json"],
      settings: {
        foreground: colors.variable,
      },
    },
  ];
};

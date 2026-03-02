import type { TokenColor } from "../types";
import type { EditorColor } from "../themes/types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[go] Comment",
      scope: ["comment.block.go", "comment.line.double-slash.go"],
      settings: {
        foreground: colors.comment,
        fontStyle: "italic",
      },
    },
    {
      name: "[go] Comment punctuations",
      scope: ["punctuation.definition.comment.go"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[go] Function",
      scope: [
        "entity.name.function.go",
        "entity.name.function.support.builtin.go",
        "entity.name.function.support.go",
      ],
      settings: {
        foreground: colors.function,
      },
    },
    {
      name: "[go] Keywords",
      scope: [
        "keyword.channel.go",
        "keyword.const.go",
        "keyword.control.import.go",
        "keyword.control.go",
        "keyword.function.go",
        "keyword.interface.go",
        "keyword.operator.address.go",
        "keyword.operator.arithmetic.bitwise.go",
        "keyword.operator.assignment.go",
        "keyword.operator.channel.go",
        "keyword.map.go",
        "keyword.package.go",
        "keyword.struct.go",
        "keyword.type.go",
        "keyword.var.go",
      ],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[go] Keywords: function",
      scope: ["keyword.function.go"],
      settings: {
        foreground: colors.yellowBright,
      },
    },
    {
      name: "[go] Punctuations",
      scope: [
        "punctuation.definition.begin.bracket.curly.go",
        "punctuation.definition.begin.bracket.round.go",
        "punctuation.definition.begin.bracket.square.go",
        "punctuation.definition.end.bracket.curly.go",
        "punctuation.definition.end.bracket.round.go",
        "punctuation.definition.end.bracket.square.go",
        "punctuation.definition.imports.begin.bracket.round.go",
        "punctuation.definition.imports.end.bracket.round.go",
        "punctuation.definition.string.begin.go",
        "punctuation.definition.string.end.go",
        "punctuation.other.colon.go",
        "punctuation.other.comma.go",
        "punctuation.other.period.go",
        "punctuation.terminator.go",
      ],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[go] Type definition",
      scope: [
        "entity.name.import.go",
        "entity.name.type.any.go",
        "entity.name.type.comparable.go",
        "entity.name.type.go",
        "entity.name.type.package.go",
        "storage.type.boolean.go",
        "storage.type.byte.go",
        "storage.type.error.go",
        "storage.type.numeric.go",
        "storage.type.string.go",
      ],
      settings: {
        foreground: colors.type,
      },
    },
    {
      name: "[go] Value: boolean",
      scope: ["constant.language.boolean.go"],
      settings: {
        foreground: colors.boolean,
      },
    },
    {
      name: "[go] Value: iota",
      scope: ["constant.language.iota.go"],
      settings: {
        foreground: colors.purple,
      },
    },
    {
      name: "[go] Value: nil",
      scope: ["constant.language.null.go"],
      settings: {
        foreground: colors.nullable,
      },
    },
    {
      name: "[go] Value: number",
      scope: ["constant.numeric.decimal.go"],
      settings: {
        foreground: colors.number,
      },
    },
    {
      name: "[go] Value: rune",
      scope: ["constant.other.rune.go"],
      settings: {
        foreground: colors.red,
      },
    },
    {
      name: "[go] Value: string",
      scope: ["string.quoted.double.go", "string.quoted.raw.go"],
      settings: {
        foreground: colors.string,
      },
    },
    {
      name: "[go] Variable names",
      scope: [
        "variable.other.assignment.go",
        "variable.other.constant.go",
        "variable.other.property.go",
        "variable.other.go",
        "variable.parameter.go",
      ],
      settings: {
        foreground: colors.variable,
      },
    },
  ];
};

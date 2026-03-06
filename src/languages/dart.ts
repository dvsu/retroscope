import type { TokenColor } from "../types";
import type { EditorColor } from "../themes/types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[dart] Comment",
      scope: ["comment.line.double-slash.dart"],
      settings: {
        foreground: colors.comment,
        fontStyle: "italic",
      },
    },
    {
      name: "[dart] Function, method, decorator",
      scope: ["entity.name.function.dart", "storage.type.annotation.dart"],
      settings: {
        foreground: colors.function,
      },
    },
    {
      name: "[dart] Keywords",
      scope: [
        "keyword.operator.bitwise.dart",
        "keyword.control.catch-exception.dart",
        "keyword.control.return.dart",
        "keyword.declaration.dart",
        "keyword.operator.arithmetic.dart",
        "keyword.operator.assignment.dart",
        "keyword.operator.closure.dart",
        "keyword.operator.comparison.dart",
        "keyword.operator.ternary.dart",
        "keyword.other.import.dart",
        "other.source.dart", // generic angle bracket
        "storage.modifier.dart", // const, final, late, required
        "variable.language.dart", // super, this
      ],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[dart] Keywords: function, async, if-else, switch-case, yield",
      scope: ["keyword.control.dart"],
      settings: {
        foreground: colors.brightYellow,
      },
    },
    {
      name: "[dart] Misc",
      scope: ["source.dart"],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      name: "[dart] Punctuations",
      scope: [
        "meta.embedded.expression.dart",
        "punctuation.comma.dart",
        "punctuation.dot.dart",
        "punctuation.terminator.dart",
      ],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[dart] Type definition",
      scope: ["storage.type.primitive.dart", "support.class.dart"],
      settings: {
        foreground: colors.type,
      },
    },
    {
      name: "[dart] Value: boolean",
      scope: ["	constant.language.dart"],
      settings: {
        foreground: colors.boolean,
      },
    },
    {
      name: "[dart] Value: boolean, number",
      scope: ["constant.numeric.dart"],
      settings: {
        foreground: colors.number,
      },
    },
    {
      name: "[dart] Value: string",
      scope: ["string.interpolated.single.dart"],
      settings: {
        foreground: colors.string,
      },
    },
    {
      name: "[dart] Variable names",
      scope: ["meta.declaration.dart", "variable.parameter.dart"],
      settings: {
        foreground: colors.variable,
      },
    },
  ];
};

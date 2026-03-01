import type { TokenColor } from "../types";
import type { EditorColor } from "../themes/types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[Python] Comment",
      scope: ["comment.line.number-sign.python"],
      settings: {
        foreground: colors.comment,
        fontStyle: "italic",
      },
    },
    {
      name: "[Python] Comment punctuations",
      scope: ["punctuation.definition.comment.python"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[Python] Function, method, decorator",
      scope: [
        "entity.name.function.python",
        "entity.name.function.decorator.python",
        "meta.function-call.generic.python",
        "support.function.builtin.python",
        "variable.language.special.cls.python",
      ],
      settings: {
        foreground: colors.function,
      },
    },
    {
      name: "[Python] Keywords",
      scope: [
        "keyword.control.flow.python",
        "keyword.control.import.python",
        "storage.type.class.python",
        "storage.type.format.python",
        "storage.type.function.lambda.python",
        "storage.type.imaginary.number.python",
        "storage.type.string.python",
      ],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[Python] Keywords: function, async",
      scope: [
        "storage.type.function.python",
        "storage.type.function.async.python",
      ],
      settings: {
        foreground: colors.yellow,
      },
    },
    {
      name: "[Python] Misc",
      scope: ["source.python"],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      name: "[Python] Punctuations",
      scope: [
        "constant.character.format.placeholder.other.python",
        "meta.function.parameters.python",
        "punctuation.definition.arguments.begin.python",
        "punctuation.definition.arguments.end.python",
        "punctuation.definition.decorator.python",
        "punctuation.definition.dict.begin.python",
        "punctuation.definition.dict.end.python",
        "punctuation.definition.inheritance.begin.python",
        "punctuation.definition.inheritance.end.python",
        "punctuation.definition.list.begin.python",
        "punctuation.definition.list.end.python",
        "punctuation.definition.parameters.begin.python",
        "punctuation.definition.parameters.end.python",
        "punctuation.definition.string.begin.python",
        "punctuation.definition.string.end.python",
        "punctuation.parenthesis.begin.python",
        "punctuation.parenthesis.end.python",
        "punctuation.section.function.begin.python",
        "punctuation.section.function.lambda.begin.python",
        "punctuation.separator.annotation.result.python",
        "punctuation.separator.arguments.python",
        "punctuation.separator.dict.python",
        "punctuation.separator.element.python",
        "punctuation.separator.parameters.python",
        "punctuation.separator.period.python",
      ],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[Python] Punctuations: colon",
      scope: [
        "punctuation.separator.annotation.python",
        "punctuation.separator.colon.python",
      ],
      settings: {
        foreground: colors.typeAnnotation,
      },
    },
    {
      name: "[Python] Support variables",
      scope: ["support.function.magic.python", "support.variable.magic.python"],
      settings: {
        foreground: colors.purple,
      },
    },
    {
      name: "[Python] Type definition",
      scope: [
        "entity.name.type.class.python",
        "entity.other.inherited-class.python",
        "meta.indexed-name.python",
        "support.type.python",
        "support.type.builtin.python",
        "support.type.exception.python",
      ],
      settings: {
        foreground: colors.type,
      },
    },
    {
      name: "[Python] Value: boolean",
      scope: ["constant.language.python"],
      settings: {
        foreground: colors.boolean,
      },
    },
    {
      name: "[Python] Value: number",
      scope: ["constant.numeric.dec.python", "constant.numeric.float.python"],
      settings: {
        foreground: colors.number,
      },
    },
    {
      name: "[Python] Value: string",
      scope: [
        "string.quoted.docstring.multi.python",
        "string.quoted.double.python",
        "string.quoted.raw.single.python",
        "string.quoted.multi.python",
        "string.quoted.single.python",
        "string.quoted.binary.single.python",
      ],
      settings: {
        foreground: colors.string,
      },
    },
    {
      name: "[Python] Variable names",
      scope: [
        "constant.other.caps.python",
        "constant.other.ellipsis.python",
        "meta.fstring.python",
        "meta.function-call.arguments.python",
        "variable.language.special.self.python",
        "variable.parameter.function.language.python",
        "variable.parameter.function.language.special.self.python",
      ],
      settings: {
        foreground: colors.variable,
      },
    },
  ];
};

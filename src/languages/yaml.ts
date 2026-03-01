import type { TokenColor } from "../types";
import type { EditorColor } from "../themes/types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[yaml] Anchor",
      scope: ["entity.name.type.anchor.yaml"],
      settings: {
        foreground: colors.blue,
      },
    },
    {
      name: "[yaml] Chomping indicators",
      scope: ["storage.modifier.chomping-indicator.yaml"],
      settings: {
        foreground: colors.yellow,
      },
    },
    {
      name: "[yaml] Comment",
      scope: ["comment.line.number-sign.yaml"],
      settings: {
        foreground: colors.comment,
        fontStyle: "italic",
      },
    },
    {
      name: "[yaml] Comment punctuations",
      scope: ["punctuation.definition.comment.yaml"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[yaml] Keywords",
      scope: [
        "keyword.control.flow.alias.yaml",
        "keyword.control.flow.block-scalar.folded.yaml",
        "keyword.control.flow.block-scalar.literal.yaml",
        "keyword.control.property.anchor.yaml",
        "keyword.other.directive.tag.yaml",
        "keyword.other.directive.yaml.yaml",
        "meta.block-mapping.yaml",
      ],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[yaml] Punctuations",
      scope: [
        "entity.other.document.begin.yaml",
        "entity.other.document.end.yaml",
        "punctuation.definition.block.sequence.item.yaml",
        "punctuation.definition.directive.begin.yaml",
        "punctuation.definition.sequence.begin.yaml",
        "punctuation.definition.sequence.end.yaml",
        "punctuation.definition.string.begin.yaml",
        "punctuation.definition.string.end.yaml",
        "punctuation.separator.key-value.mapping.yaml",
        "punctuation.separator.sequence.yaml",
      ],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[yaml] Variable: alias",
      scope: ["variable.other.alias.yaml"],
      settings: {
        foreground: colors.purple,
      },
    },

    {
      name: "[yaml] Value: boolean",
      scope: ["constant.language.boolean.yaml"],
      settings: {
        foreground: colors.boolean,
      },
    },
    {
      name: "[yaml] Value: null",
      scope: ["constant.language.null.yaml"],
      settings: {
        foreground: colors.nullable,
      },
    },
    {
      name: "[yaml] Value: number",
      scope: [
        "constant.language.merge.yaml",
        "constant.language.value.yaml",
        "constant.numeric.float.yaml",
        "constant.numeric.indentation-indicator.yaml",
        "constant.numeric.integer.yaml",
        "constant.other.timestamp.yaml",
      ],
      settings: {
        foreground: colors.number,
      },
    },
    {
      name: "[yaml] Value: string",
      scope: [
        "string.quoted.double.yaml",
        "string.quoted.single.yaml",
        "string.unquoted.block.yaml",
        "string.unquoted.plain.in.yaml",
        "string.unquoted.plain.out.yaml",
      ],
      settings: {
        foreground: colors.string,
      },
    },
    {
      name: "[yaml] Variable/ property names",
      scope: ["entity.name.tag.yaml"],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      name: "[yaml] Version and tags",
      scope: [
        "constant.numeric.yaml-version.yaml",
        "support.type.tag-prefix.yaml",
        "storage.type.tag-handle.yaml",
      ],
      settings: {
        foreground: colors.type,
      },
    },
  ];
};

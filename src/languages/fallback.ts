import type { TokenColor } from "../types";
import type { EditorColor } from "../themes/types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[default] Comment",
      scope: ["comment.line"],
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
      scope: ["entity.name.function"],
      settings: {
        foreground: colors.function,
      },
    },
    {
      name: "[default] Keywords",
      scope: ["keyword"],
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
  ];
};

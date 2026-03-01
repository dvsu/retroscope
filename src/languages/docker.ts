import type { TokenColor } from "../types";
import type { EditorColor } from "../themes/types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[dockerfile] Comment",
      scope: ["comment.line.number-sign.dockerfile"],
      settings: {
        foreground: colors.comment,
        fontStyle: "italic",
      },
    },
    {
      name: "[dockerfile] Comment punctuations",
      scope: ["punctuation.definition.comment.dockerfile"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[dockerfile] Keywords",
      scope: [
        "keyword.control.dockerfile",
        "keyword.other.special-method.dockerfile",
      ],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[dockerfile] Value: string",
      scope: ["string.quoted.double.dockerfile"],
      settings: {
        foreground: colors.string,
      },
    },
  ];
};

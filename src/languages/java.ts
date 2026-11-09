import type { EditorColor } from "../themes/types";
import type { TokenColor } from "../types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[java] Package and import paths",
      scope: [
        "storage.modifier.package.java",
        "storage.modifier.import.java",
        "meta.import.java storage.modifier.import.java",
        "meta.import.java entity.name.type",
        "meta.import.java entity.name.class",
        "meta.import.java storage.type",
        "meta.import.java",
      ],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      name: "[java] Storage modifiers and keywords",
      scope: [
        "storage.modifier.java",
        "storage.modifier.extends.java",
        "storage.modifier.implements.java",
      ],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      // TypeScript draws this, new, =>, let and const in the keyword colour.
      name: "[java] this, super, new, lambda arrows and var",
      scope: [
        "source.java variable.language",
        "source.java keyword.control.new",
        "source.java storage.type.function.arrow",
        "source.java storage.type.local",
        "source.java storage.type.variable",
      ],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[java] Annotations",
      scope: ["storage.type.annotation.java"],
      settings: {
        foreground: colors.function,
      },
    },
  ];
};

import type { TokenColor } from "../types";
import type { EditorColor } from "../themes/types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[TypeScript] Built-in classes: Object, Array",
      scope: [
        "support.class.builtin.ts",
        "support.class.promise.ts",
        "support.constant.math.ts",
      ],
      settings: {
        foreground: colors.yellow,
      },
    },
    {
      name: "[TypeScript] Comment",
      scope: ["comment.block.documentation.ts", "comment.line.double-slash.ts"],
      settings: {
        foreground: colors.comment,
        fontStyle: "italic",
      },
    },
    {
      name: "[TypeScript] Comment punctuations",
      scope: ["punctuation.definition.comment.ts"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[TypeScript] Function and method",
      scope: [
        "entity.name.function.ts",
        "support.function.math.ts",
        "support.function.ts",
      ],
      settings: {
        foreground: colors.function,
      },
    },
    {
      name: "[TypeScript] Import all",
      scope: ["constant.language.import-export-all.ts"],
      settings: {
        foreground: colors.accentPrimary,
      },
    },
    {
      name: "[TypeScript] Keywords",
      scope: [
        "keyword.control.anchor.regexp",
        "keyword.control.as.ts",
        "keyword.control.conditional.ts",
        "keyword.control.default.ts",
        "keyword.control.export.ts",
        "keyword.control.flow.ts",
        "keyword.control.from.ts",
        "keyword.control.import.ts",
        "keyword.control.loop.ts",
        "keyword.control.satisfies.ts",
        "keyword.control.switch.ts",
        "keyword.control.trycatch.ts",
        "keyword.control.type.ts",
        "keyword.operator",
        "keyword.operator.arithmetic.ts",
        "keyword.operator.assignment.ts",
        "keyword.operator.comparison.ts",
        "keyword.operator.decrement.ts",
        "keyword.operator.expression.import.ts",
        "keyword.operator.expression.of.ts",
        "keyword.operator.expression.typeof.ts",
        "keyword.operator.logical.ts",
        "keyword.operator.new.ts",
        "keyword.operator.optional.ts",
        "keyword.operator.relational.ts",
        "keyword.operator.spread.ts",
        "keyword.operator.ternary.ts",
        "keyword.operator.type.ts",
        "storage.type.class.ts",
        "storage.type.function.arrow.ts",
        "storage.type.interface.ts",
        "storage.type.type.ts",
        "variable.language.this.ts",
        "variable.language.super.ts",
      ],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[TypeScript] Keywords: const",
      scope: ["storage.modifier.ts", "storage.type.ts", "storage.type.enum.ts"],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[TypeScript] Keywords: function, async",
      scope: ["storage.type.function.ts", "storage.modifier.async.ts"],
      settings: {
        foreground: colors.yellow,
      },
    },
    {
      name: "[TypeScript] Object key",
      scope: ["meta.object-literal.key.ts"],
      settings: {
        foreground: colors.foreground,
      },
    },
    {
      name: "[TypeScript] Punctuations",
      scope: [
        "punctuation.accessor.ts",
        "punctuation.accessor.optional.ts",
        "punctuation.definition.binding-pattern.object.ts",
        "punctuation.definition.block.ts",
        "punctuation.definition.group.regexp",
        "punctuation.definition.parameters.begin.ts",
        "punctuation.definition.parameters.end.ts",
        "punctuation.definition.string.begin.ts",
        "punctuation.definition.string.end.ts",
        "punctuation.definition.template-expression.begin.ts",
        "punctuation.definition.template-expression.end.ts",
        "punctuation.definition.typeparameters.begin.ts",
        "punctuation.definition.typeparameters.end.ts",
        "punctuation.separator.comma.ts",
        "punctuation.separator.key-value.ts",
        "punctuation.separator.parameter.ts",
        "punctuation.terminator.statement.ts",
      ],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[TypeScript] Punctuations: colon",
      scope: ["keyword.operator.type.annotation.ts"],
      settings: {
        foreground: colors.typeAnnotation,
      },
    },
    {
      name: "[TypeScript] Regexp character class",
      scope: ["punctuation.definition.character-class.regexp"],
      settings: {
        foreground: colors.accentSecondary,
      },
    },
    {
      name: "[TypeScript] Regexp negation",
      scope: ["keyword.operator.negation.regexp"],
      settings: {
        foreground: colors.orange,
      },
    },
    {
      name: "[TypeScript] Regexp other character class",
      scope: ["constant.other.character-class", "string.regexp.ts"],
      settings: {
        foreground: colors.green,
      },
    },
    {
      name: "[TypeScript] Regexp quantifier",
      scope: ["keyword.operator.quantifier"],
      settings: {
        foreground: colors.purple,
      },
    },
    {
      name: "[TypeScript] Round braces",
      scope: ["meta.brace.round.ts"],
      settings: {
        foreground: colors.accentPrimary,
      },
    },
    {
      name: "[TypeScript] Square braces",
      scope: ["meta.brace.square.ts"],
      settings: {
        foreground: colors.orange,
      },
    },
    {
      name: "[TypeScript] Support variables",
      scope: [
        "support.variable.property.ts",
        "support.variable.property.importmeta.ts",
      ],
      settings: {
        foreground: colors.purple,
      },
    },
    {
      name: "[TypeScript] Type definition",
      scope: [
        "entity.name.type.ts",
        "entity.name.type.alias.ts",
        "entity.name.type.class.ts",
        "entity.name.type.enum.ts",
        "entity.name.type.interface.ts",
        "entity.name.type.module.ts",
        "entity.other.inherited-class.ts",
        "keyword.operator.expression.void.ts",
        "support.class.error.ts",
        "support.type.builtin.ts",
        "support.type.primitive.ts",
      ],
      settings: {
        foreground: colors.type,
      },
    },
    {
      name: "[TypeScript] Value: boolean",
      scope: [
        "constant.language.boolean.false.ts",
        "constant.language.boolean.true.ts",
      ],
      settings: {
        foreground: colors.boolean,
      },
    },
    {
      name: "[TypeScript] Value: null, undefined",
      scope: ["constant.language.null.ts", "constant.language.undefined.ts"],
      settings: {
        foreground: colors.nullable,
      },
    },
    {
      name: "[TypeScript] Value: number",
      scope: ["constant.numeric.decimal.ts"],
      settings: {
        foreground: colors.number,
      },
    },
    {
      name: "[TypeScript] Value: string",
      scope: [
        "string.quoted.double.ts",
        "string.quoted.single.ts",
        "string.template.ts",
      ],
      settings: {
        foreground: colors.string,
      },
    },
    {
      name: "[TypeScript] Variable names",
      scope: [
        "variable.object.property.ts",
        "variable.other.constant.ts",
        "variable.other.constant.object.ts",
        "variable.other.constant.property.ts",
        "variable.other.enummember.ts",
        "variable.other.object.ts",
        "variable.other.object.property.ts",
        "variable.other.property.ts",
        "variable.other.readwrite.ts",
        "variable.other.readwrite.alias.ts",
        "variable.parameter.ts",
      ],
      settings: {
        foreground: colors.variable,
      },
    },
  ];
};

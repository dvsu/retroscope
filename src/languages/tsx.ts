import type { TokenColor } from "../types";
import type { EditorColor } from "../themes/types";

export const generate = (colors: EditorColor): TokenColor[] => {
  return [
    {
      name: "[tsx] Built-in classes: Object, Array",
      scope: [
        "support.class.builtin.tsx",
        "support.class.promise.tsx",
        "support.constant.math.tsx",
      ],
      settings: {
        foreground: colors.brightYellow,
      },
    },
    {
      name: "[tsx] Children",
      scope: ["meta.tag.without-attributes.tsx"],
      settings: {
        foreground: colors.foreground,
      },
    },
    {
      name: "[tsx] Comment",
      scope: [
        "comment.block.documentation.tsx",
        "comment.line.double-slash.tsx",
      ],
      settings: {
        foreground: colors.comment,
        fontStyle: "italic",
      },
    },
    {
      name: "[tsx] Comment punctuations",
      scope: ["punctuation.definition.comment.tsx"],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[tsx] Function, method, decorator",
      scope: [
        "meta.decorator.tsx",
        "meta.definition.function.tsx",
        "meta.definition.method.tsx",
        "meta.function-call.tsx",
        "support.function.math.tsx",
        "support.function.tsx",
      ],
      settings: {
        foreground: colors.function,
      },
    },
    {
      name: "[tsx] Keywords: Function keywords",
      scope: ["storage.type.function.tsx", "storage.modifier.async.tsx"],
      settings: {
        foreground: colors.brightYellow,
      },
    },
    {
      name: "[tsx] Import all",
      scope: ["constant.language.import-export-all.tsx"],
      settings: {
        foreground: colors.accentPrimary,
      },
    },
    {
      name: "[tsx] Keywords",
      scope: [
        "cast.expr.tsx",
        "keyword.control.anchor.regexp",
        "keyword.control.as.tsx",
        "keyword.control.conditional.tsx",
        "keyword.control.default.tsx",
        "keyword.control.export.tsx",
        "keyword.control.flow.tsx",
        "keyword.control.from.tsx",
        "keyword.control.import.tsx",
        "keyword.control.loop.tsx",
        "keyword.control.satisfies.tsx",
        "keyword.control.switch.tsx",
        "keyword.control.trycatch.tsx",
        "keyword.control.type.tsx",
        "keyword.operator",
        "keyword.operator.arithmetic.tsx",
        "keyword.operator.assignment.tsx",
        "keyword.operator.comparison.tsx",
        "keyword.operator.decrement.tsx",
        "keyword.operator.expression.import.tsx",
        "keyword.operator.expression.of.tsx",
        "keyword.operator.expression.typeof.tsx",
        "keyword.operator.logical.tsx",
        "keyword.operator.new.tsx",
        "keyword.operator.optional.tsx",
        "keyword.operator.relational.tsx",
        "keyword.operator.spread.tsx",
        "keyword.operator.ternary.tsx",
        "keyword.operator.type.tsx",
        "storage.type.class.tsx",
        "storage.type.function.arrow.tsx",
        "storage.type.interface.tsx",
        "storage.type.namespace.tsx",
        "storage.type.property.tsx",
        "storage.type.type.tsx",
        "variable.language.this.tsx",
        "variable.language.super.tsx",
      ],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[tsx] Keywords: const",
      scope: [
        "storage.modifier.tsx",
        "storage.type.tsx",
        "storage.type.enum.tsx",
      ],
      settings: {
        foreground: colors.keyword,
      },
    },
    {
      name: "[tsx] Object key",
      scope: ["meta.object-literal.key.tsx"],
      settings: {
        foreground: colors.foreground,
      },
    },
    {
      name: "[tsx] Label",
      scope: ["entity.name.label.tsx"],
      settings: {
        foreground: colors.brightYellow,
      },
    },
    {
      name: "[tsx] Misc",
      scope: ["source.tsx"],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      name: "[tsx] Punctuations",
      scope: [
        "punctuation.accessor.tsx",
        "punctuation.accessor.optional.tsx",
        "punctuation.decorator.tsx",
        "punctuation.definition.binding-pattern.array.tsx",
        "punctuation.definition.binding-pattern.object.tsx",
        "punctuation.definition.block.tsx",
        "punctuation.definition.section.case-statement.tsx",
        "punctuation.definition.group.regexp",
        "punctuation.definition.parameters.begin.tsx",
        "punctuation.definition.parameters.end.tsx",
        "punctuation.definition.string.begin.tsx",
        "punctuation.definition.string.end.tsx",
        "punctuation.definition.tag.begin.tsx",
        "punctuation.definition.tag.directive.tsx",
        "punctuation.definition.tag.end.tsx",
        "punctuation.definition.template-expression.begin.tsx",
        "punctuation.definition.template-expression.end.tsx",
        "punctuation.definition.typeparameters.begin.tsx",
        "punctuation.definition.typeparameters.end.tsx",
        "punctuation.section.embedded.begin.tsx",
        "punctuation.section.embedded.end.tsx",
        "punctuation.separator.comma.tsx",
        "punctuation.separator.key-value.tsx",
        "punctuation.separator.parameter.tsx",
        "punctuation.terminator.statement.tsx",
      ],
      settings: {
        foreground: colors.punctuation,
      },
    },
    {
      name: "[tsx] Punctuations: colon",
      scope: [
        "keyword.operator.type.annotation.tsx",
        "punctuation.separator.label.tsx",
      ],
      settings: {
        foreground: colors.typeAnnotation,
      },
    },
    {
      name: "[tsx] Regexp character class",
      scope: ["punctuation.definition.character-class.regexp"],
      settings: {
        foreground: colors.accentSecondary,
      },
    },
    {
      name: "[tsx] Regexp negation",
      scope: ["keyword.operator.negation.regexp"],
      settings: {
        foreground: colors.orange,
      },
    },
    {
      name: "[tsx] Regexp other character class",
      scope: ["constant.other.character-class", "string.regexp.tsx"],
      settings: {
        foreground: colors.green,
      },
    },
    {
      name: "[tsx] Regexp quantifier",
      scope: ["keyword.operator.quantifier"],
      settings: {
        foreground: colors.purple,
      },
    },
    {
      name: "[tsx] Round braces",
      scope: ["meta.brace.round.tsx"],
      settings: {
        foreground: colors.accentPrimary,
      },
    },
    {
      name: "[tsx] Square braces",
      scope: ["meta.brace.square.tsx"],
      settings: {
        foreground: colors.orange,
      },
    },
    {
      name: "[tsx] Support variables",
      scope: [
        "support.constant.property.math.tsx",
        "support.variable.property.tsx",
        "support.variable.property.importmeta.tsx",
      ],
      settings: {
        foreground: colors.purple,
      },
    },
    {
      name: "[tsx] Tag attributes",
      scope: ["entity.other.attribute-name.tsx"],
      settings: {
        foreground: colors.orange,
      },
    },
    {
      name: "[tsx] Tags",
      scope: ["entity.name.tag.directive.tsx", "entity.name.tag.tsx"],
      settings: {
        foreground: colors.brightOrange,
      },
    },
    {
      name: "[tsx] Type definition",
      scope: [
        "entity.name.type.tsx",
        "entity.name.type.alias.tsx",
        "entity.name.type.class.tsx",
        "entity.name.type.enum.tsx",
        "entity.name.type.interface.tsx",
        "entity.name.type.module.tsx",
        "entity.other.inherited-class.tsx",
        "keyword.operator.expression.void.tsx",
        "support.class.error.tsx",
        "support.type.builtin.tsx",
        "support.type.primitive.tsx",
      ],
      settings: {
        foreground: colors.type,
      },
    },
    {
      name: "[tsx] Value: boolean",
      scope: [
        "constant.language.boolean.false.tsx",
        "constant.language.boolean.true.tsx",
      ],
      settings: {
        foreground: colors.boolean,
      },
    },
    {
      name: "[tsx] Value: null, undefined",
      scope: ["constant.language.null.tsx", "constant.language.undefined.tsx"],
      settings: {
        foreground: colors.nullable,
      },
    },
    {
      name: "[tsx] Value: number",
      scope: ["constant.numeric.decimal.tsx"],
      settings: {
        foreground: colors.number,
      },
    },
    {
      name: "[tsx] Value: string",
      scope: [
        "string.quoted.double.tsx",
        "string.quoted.single.tsx",
        "string.template.tsx",
      ],
      settings: {
        foreground: colors.string,
      },
    },
    {
      name: "[tsx] Variable names",
      scope: [
        "entity.other.attribute-name.directive.tsx",
        "meta.block.tsx",
        "meta.embedded.expression.tsx",
        "meta.export.default.tsx",
        "meta.parameters.tsx",
        "meta.var.expr.tsx",
        "switch-expression.expr.tsx",
        "variable.object.property.tsx",
        "variable.other.constant.tsx",
        "variable.other.constant.object.tsx",
        "variable.other.constant.property.tsx",
        "variable.other.enummember.tsx",
        "variable.other.object.tsx",
        "variable.other.object.property.tsx",
        "variable.other.property.tsx",
        "variable.other.readwrite.alias.tsx",
        "variable.parameter.tsx",
      ],
      settings: {
        foreground: colors.variable,
      },
    },
  ];
};

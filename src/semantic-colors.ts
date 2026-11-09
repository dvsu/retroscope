import type { EditorColor } from "./themes/types";

/**
 * Colours for semantic tokens, used where a language server labels code
 * (VS Code and Cursor with the C# extension, for example).
 *
 * Token types without an entry here take the colour of the TextMate rule
 * VS Code maps them to, so they match what editors without the server show.
 * Coarse types such as `keyword`, `operator`, `punctuation` and `string`
 * deliberately find no rule (see textMateOnly in src/semantic.ts) and keep
 * the grammar's finer colours. src/semantic.test.ts checks the result
 * against real C# tokens.
 */
export const generate = (colors: EditorColor): Record<string, string> => ({
  // Functions and methods are set here, because their TextMate rule is kept
  // away from semantic tokens: C# labels `#region` a macro and a user-defined
  // `+` an overloaded operator, which would otherwise borrow it.
  function: colors.function,
  method: colors.function,
  // C# makes a delegate a kind of method, but names it like a type.
  delegate: colors.type,
  // Java names a constructor after its class; the grammar colours it like a
  // method, as Red Hat's Java extension intends.
  "*.constructor": colors.function,
  // Names in import lines, coloured like the rest of the import path.
  "*.importDeclaration": colors.variable,
});

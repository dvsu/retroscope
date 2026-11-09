import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { GRAMMAR_LIMITS, lexemeColours, RENDERINGS, roleColour, roleOf } from "./constructs";
import { generateTheme } from "./generate";
import { themes } from "./themes";

for (const module of themes) {
  const { colors } = module.create();
  const { metadata, theme } = generateTheme(module);
  describe(`keywords and symbols follow TypeScript: ${metadata.id}`, () => {
    for (const rendering of RENDERINGS) {
      test(rendering.id, async () => {
        const limits = new Set(
          GRAMMAR_LIMITS.filter((l) => l.rendering === rendering.id).flatMap((l) => l.lexemes),
        );
        const wrong = new Set<string>();
        for (const { lexeme, line, colour } of await lexemeColours(rendering, theme)) {
          if (limits.has(lexeme)) continue;
          const role = roleOf(rendering.language, lexeme);
          if (!role) continue;
          const expected = roleColour(colors, role);
          if (colour.toUpperCase() !== expected.toUpperCase()) {
            wrong.add(
              `${JSON.stringify(lexeme)} on line ${line + 1} is ${colour}, should be ${role} ${expected}`,
            );
          }
        }
        assert.deepEqual([...wrong], []);
      });
    }

    test("every grammar limit is still needed", async () => {
      for (const limit of GRAMMAR_LIMITS) {
        const rendering = RENDERINGS.find((r) => r.id === limit.rendering);
        assert.ok(rendering, `unknown rendering ${limit.rendering}`);
        const seen = await lexemeColours(rendering, theme);
        for (const lexeme of limit.lexemes) {
          const role = roleOf(rendering.language, lexeme);
          const off = seen.some(
            (s) =>
              s.lexeme === lexeme &&
              role !== undefined &&
              s.colour.toUpperCase() !== roleColour(colors, role).toUpperCase(),
          );
          assert.ok(
            off,
            `${limit.rendering}: ${lexeme} now follows TypeScript, drop it from GRAMMAR_LIMITS`,
          );
        }
      }
    });
  });
}

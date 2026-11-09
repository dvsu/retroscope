import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import { EDITOR_GRAMMARS, loadRecording } from "./editor-grammars";
import { generateTheme } from "./generate";
import { resolveSemanticStyle, type SemanticLegend, textMateOnly } from "./semantic";
import { sha256 } from "./semantic-capture";
import {
  KNOWN_MERGES,
  loadFixture,
  SEMANTIC_LANGUAGES,
  SEMANTIC_PAIRINGS,
  semanticDifferencesFor,
} from "./semantic-fixture";
import { themes } from "./themes";
import type { VSCodeTheme } from "./types";

const root = path.resolve(import.meta.dirname, "..");

const legend: SemanticLegend = {
  language: "csharp",
  superTypes: { controlKeyword: "keyword", field: "property" },
  scopes: { keyword: ["keyword.cs"], field: ["entity.name.variable.field.cs"] },
};
const theme = (
  tokenColors: VSCodeTheme["tokenColors"],
  semanticTokenColors: VSCodeTheme["semanticTokenColors"] = {},
): VSCodeTheme => ({ name: "t", type: "dark", colors: {}, tokenColors, semanticTokenColors });
const rule = (scope: string[], foreground: string) => ({
  name: scope[0] ?? "",
  scope,
  settings: { foreground },
});

describe("semantic token colours, as VS Code resolves them", () => {
  test("a theme's semantic colour wins over the TextMate fallback", () => {
    const t = theme([rule(["entity.name.type"], "#111111")], { class: "#222222" });
    assert.equal(resolveSemanticStyle(t, legend, "class", [])?.foreground, "#222222");
  });

  test("without one, the token takes the TextMate rule for its fallback scope", () => {
    const t = theme([rule(["entity.name.type"], "#111111")]);
    assert.equal(resolveSemanticStyle(t, legend, "class", [])?.foreground, "#111111");
  });

  test("an extension's fallback scope for its language beats the general one", () => {
    const t = theme([rule(["keyword.control"], "#111111"), rule(["keyword.cs"], "#222222")]);
    assert.equal(resolveSemanticStyle(t, legend, "keyword", [])?.foreground, "#222222");
  });

  test("a token type inherits its parent type's colour", () => {
    const t = theme([], { property: "#333333" });
    assert.equal(resolveSemanticStyle(t, legend, "field", [])?.foreground, "#333333");
  });

  test("a selector naming an ancestor never styles a semantic token, so TextMate's colour stays", () => {
    const t = theme([rule(textMateOnly("keyword"), "#111111")]);
    assert.equal(resolveSemanticStyle(t, legend, "keyword", []), undefined);
    assert.equal(resolveSemanticStyle(t, legend, "controlKeyword", []), undefined);
  });
});

for (const language of SEMANTIC_LANGUAGES) {
  const fixture = loadFixture(language);
  test(`${language}: the recorded tokens match ${fixture.source}`, () => {
    const source = fs.readFileSync(path.join(root, fixture.source), "utf8");
    assert.equal(
      sha256(source),
      fixture.sourceSha256,
      `${fixture.source} changed: run yarn semantic-tokens ${language}`,
    );
  });
}

for (const { language, textMate } of SEMANTIC_PAIRINGS) {
  describe(`${language} looks the same with semantic highlighting on and off (${textMate} grammar)`, () => {
    for (const module of themes) {
      const { metadata, theme } = generateTheme(module);
      for (const otherExtensions of [false, true]) {
        const where = otherExtensions ? ", with other language extensions installed" : "";
        test(`${metadata.id}: every token keeps its colour, apart from the known cases${where}`, async () => {
          const { differences } = await semanticDifferencesFor(
            language,
            theme,
            otherExtensions,
            textMate,
          );
          const listed = differences.map(
            (d) =>
              `line ${d.token.line + 1} ${JSON.stringify(d.text)} (${d.token.type}): ${d.semantic.foreground} vs ${d.textMate.foreground} ${d.textMate.scope}`,
          );
          assert.deepEqual(listed, [], "see yarn semantic, and src/semantic-colors.ts");
        });
      }
    }

    test("every known case still happens, so the list stays short", async () => {
      const [base] = themes;
      assert.ok(base, "no themes");
      const { allowed } = await semanticDifferencesFor(
        language,
        generateTheme(base).theme,
        true,
        textMate,
      );
      const merges = KNOWN_MERGES.filter(
        (m) => m.language === language && (m.textMate === undefined || m.textMate === textMate),
      );
      for (const merge of merges) {
        assert.ok(
          allowed.some(
            (d) =>
              (merge.type === "*" || d.token.type === merge.type) &&
              merge.scopes.test(d.textMate.scope),
          ),
          `no longer needed: ${merge.type} ${merge.scopes}`,
        );
      }
    });
  });
}

describe("editor grammar recordings", () => {
  for (const [id, spec] of Object.entries(EDITOR_GRAMMARS)) {
    test(`${id} matches ${spec.demo}`, () => {
      const recording = loadRecording(id);
      const source = fs.readFileSync(path.join(root, recording.source), "utf8");
      assert.equal(
        sha256(source),
        recording.sourceSha256,
        `${spec.demo} changed: run yarn editor-grammars`,
      );
    });
  }
});

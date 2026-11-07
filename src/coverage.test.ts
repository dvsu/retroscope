import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { type LanguageCoverage, measureCoverage, sampleFiles, unruledLabels } from "./coverage";
import { generateTheme } from "./generate";
import { themes } from "./themes";

// Every file in demo/ must be fully styled: no piece the grammar labels may
// be left to the catch-all colour. See the report with: yarn coverage [language]
for (const module of themes) {
  const { metadata, theme } = generateTheme(module);

  describe(`language coverage: ${metadata.id}`, () => {
    let results: LanguageCoverage[] = [];
    let unruled: { lang: string; labels: string[] }[] = [];
    before(async () => {
      results = await measureCoverage(theme);
      unruled = await unruledLabels(theme);
    });

    test("covers the agreed languages", () => {
      assert.ok(sampleFiles().length >= 26, "demo/ lost a language");
    });

    for (const { lang } of sampleFiles()) {
      test(`${lang}: every labelled piece of code has a colour rule`, () => {
        const result = results.find((r) => r.lang === lang);
        assert.ok(result && result.pieces > 0, `no tokens measured for ${lang}`);
        const missing = result.byScope
          .filter((g) => g.kind === "unstyled")
          .map((g) => `${g.scope} (${g.count}×, e.g. ${g.examples.join(", ")})`);
        assert.deepEqual(missing, [], `run: yarn coverage ${lang}`);
      });

      // The demo files exercise only part of each grammar, so also check every
      // label the grammar can produce, including ones no demo line triggers.
      test(`${lang}: every label the grammar declares has a colour rule`, () => {
        const result = unruled.find((r) => r.lang === lang);
        assert.ok(result, `no grammar checked for ${lang}`);
        assert.deepEqual(
          result.labels,
          [],
          "add a rule in src/languages, or a reviewed entry in UNRULED_LABELS",
        );
      });
    }
  });
}

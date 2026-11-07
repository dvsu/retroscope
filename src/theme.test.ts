import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { contrastRatio, isHexColor, parseHex } from "./contrast";
import { generateTheme } from "./generate";
import { checkTheme } from "./theme-checks";
import { themes } from "./themes";
import { colorMapping } from "./themes/retroscope/palette";
import type { Theme } from "./themes/types";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const generated = themes.map(generateTheme);

describe("contrast maths", () => {
  test("matches WCAG reference values", () => {
    assert.equal(contrastRatio("#000000", "#FFFFFF").toFixed(2), "21.00");
    assert.equal(contrastRatio("#777777", "#FFFFFF").toFixed(2), "4.48");
    assert.equal(contrastRatio("#FFFFFF", "#FFFFFF"), 1);
  });

  test("blends translucent colours over their base", () => {
    assert.equal(contrastRatio("#FFFFFF00", "#000000"), 1);
    assert.deepEqual(parseHex("#F0F8"), { r: 1, g: 0, b: 1, a: 0x88 / 255 });
  });

  test("rejects anything that is not a hex colour", () => {
    for (const bad of [undefined, "", "red", "#12345", "undefined60", "#GGGGGG"]) {
      assert.equal(isHexColor(bad), false, String(bad));
    }
  });
});

for (const { fileName, metadata, theme } of generated) {
  describe(`theme ${metadata.id}`, () => {
    test("passes every theme check", () => {
      assert.deepEqual(checkTheme({ fileName, metadata, theme }), []);
    });

    test("is contributed by package.json and shipped in the package", () => {
      const entry = pkg.contributes.themes.find(
        (t: { path: string }) => t.path === `./themes/${fileName}`,
      );
      assert.ok(entry, `package.json contributes.themes has no ./themes/${fileName}`);
      assert.equal(entry.label, metadata.displayName);
      assert.equal(entry.uiTheme, metadata.type === "dark" ? "vs-dark" : "vs");
      assert.ok(
        pkg.files.includes(`themes/${fileName}`),
        `package.json files lacks themes/${fileName}`,
      );
    });

    test("the built file is up to date (run yarn build)", () => {
      const built = path.join(root, "themes", fileName);
      assert.ok(fs.existsSync(built), `${built} is missing: run yarn build`);
      assert.deepEqual(JSON.parse(fs.readFileSync(built, "utf8")), theme);
    });

    test("matches the reviewed snapshot (update: yarn test:update)", (t) => {
      t.assert.snapshot(theme);
    });
  });
}

test("package.json contributes no theme the build doesn't produce", () => {
  const produced = new Set(generated.map((g) => `./themes/${g.fileName}`));
  for (const entry of pkg.contributes.themes) assert.ok(produced.has(entry.path), entry.path);
});

describe("self-test: the checks catch a broken palette", () => {
  const broken = (overrides: Partial<Theme["colors"]>) =>
    checkTheme(
      generateTheme({
        create: () => ({
          metadata: { id: "broken", type: "dark", displayName: "Broken" },
          colors: { ...colorMapping, ...overrides },
        }),
      }),
    );

  test("a missing palette entry", () => {
    const problems = broken({ accentPrimary: undefined as unknown as string });
    assert.ok(
      problems.some((p) => p.includes("not a hex colour")),
      problems.join("\n"),
    );
  });

  test("a malformed colour", () => {
    assert.ok(broken({ keyword: "#12345" }).some((p) => p.includes("not a hex colour")));
  });

  test("a required state colour left to the editor's default", () => {
    const [theme] = generated;
    const colors = { ...theme.theme.colors };
    delete colors["statusBarItem.remoteForeground"];
    const problems = checkTheme({ ...theme, theme: { ...theme.theme, colors } });
    assert.ok(problems.some((p) => p.startsWith("state: statusBarItem.remoteBackground")));
  });

  test("bright text on a bright hover", () => {
    const [theme] = generated;
    const colors = {
      ...theme.theme.colors,
      "statusBarItem.remoteHoverBackground": colorMapping.accentPrimary,
      "statusBarItem.remoteHoverForeground": colorMapping.accentPrimary,
    };
    const problems = checkTheme({ ...theme, theme: { ...theme.theme, colors } });
    assert.ok(
      problems.some((p) => p.includes("remoteHoverForeground on")),
      problems.join("\n"),
    );
  });

  test("a matching bracket hidden by its highlight box", () => {
    const [theme] = generated;
    const colors = {
      ...theme.theme.colors,
      "editorBracketMatch.background": colorMapping.accentTertiary,
      "editorBracketMatch.foreground": colorMapping.background,
    };
    const problems = checkTheme({ ...theme, theme: { ...theme.theme, colors } });
    assert.ok(
      problems.some((p) => p.startsWith("contrast: editorBracketHighlight.foreground1 on")),
      problems.join("\n"),
    );
  });

  test("unreadable text", () => {
    assert.ok(broken({ string: colorMapping.background }).some((p) => p.startsWith("contrast:")));
  });
});

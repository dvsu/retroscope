import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { contrastRatio, isHexColor, parseHex } from "./contrast";
import { COLOUR_BLINDNESS, deltaE2000, simulate } from "./distinct";
import { generateTheme } from "./generate";
import { CODE_COLOURS, checkPalette, checkTheme } from "./theme-checks";
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

describe("colour difference maths", () => {
  test("matches CIEDE2000 reference values (Sharma, Wu and Dalal 2005)", () => {
    const pairs: [number[], number[], number][] = [
      [[50, 2.6772, -79.7751], [50, 0, -82.7485], 2.0425],
      [[50, 2.5, 0], [73, 25, -18], 27.1492],
      [[50, 2.5, 0], [50, 0, -2.5], 4.3065],
      [[60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387], 1.2644],
    ];
    for (const [[l1, a1, b1], [l2, a2, b2], expected] of pairs) {
      const got = deltaE2000({ l: l1, a: a1, b: b1 }, { l: l2, a: a2, b: b2 });
      assert.equal(got.toFixed(4), expected.toFixed(4));
    }
  });

  test("colour blindness leaves greys unchanged", () => {
    for (const kind of COLOUR_BLINDNESS) assert.equal(simulate("#808080", kind), "#808080");
  });
});

test("High Contrast keeps code text at 7:1 (WCAG AAA), as the README says", () => {
  const module = themes.find((m) => m.create().metadata.id === "retroscope-high-contrast");
  assert.ok(module, "no retroscope-high-contrast theme");
  const { colors } = module.create();
  const fadedOrPunctuation = new Set(["comment", "punctuation", "typeAnnotation"]);
  for (const key of Object.keys(CODE_COLOURS) as (keyof typeof colors)[]) {
    if (fadedOrPunctuation.has(key)) {
      assert.ok(contrastRatio(colors[key], colors.background) >= 4.5, key);
    } else {
      assert.ok(contrastRatio(colors[key], colors.background) >= 7, `${key} ${colors[key]}`);
    }
  }
});

for (const module of themes) {
  const { metadata } = module.create();
  test(`palette ${metadata.id}: code colours are distinct, also with colour blindness`, () => {
    assert.deepEqual(checkPalette(module.create().colors), []);
  });
}

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
      assert.equal(entry.id, metadata.settingsId);
      assert.equal(entry.label, metadata.displayName);
      // VS Code's 320px Settings dropdown floats label and id on one 22px row
      // without a max-width; past ~42 chars the second float wraps and is clipped.
      assert.ok(
        entry.label.length + entry.id.length <= 42,
        `${entry.label} + ${entry.id} wraps in the 320px Settings dropdown; set a shorter id`,
      );
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

test("README.md showcases every theme with a screenshot", () => {
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  for (const { metadata } of generated) {
    assert.ok(
      readme.includes(`### ${metadata.displayName}\n`),
      `README.md has no heading for ${metadata.displayName}`,
    );
    const shot = `assets/screenshots/${metadata.id}-typescript.png`;
    assert.ok(readme.includes(`./${shot}`), `README.md does not link ./${shot}`);
    assert.ok(fs.existsSync(path.join(root, shot)), `${shot} is missing: run yarn screenshots`);
  }
});

describe("self-test: the checks catch a broken palette", () => {
  const broken = (overrides: Partial<Theme["colors"]>) =>
    checkTheme(
      generateTheme({
        create: () => ({
          metadata: { id: "broken", type: "dark", displayName: "Broken", settingsId: "Broken" },
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

  test("faded interface text below the faded floor", () => {
    const problems = broken({ intermediate: "#6B5B4F" });
    assert.ok(
      problems.some((p) => p.startsWith("contrast: editorLineNumber.foreground is 2.64:1")),
      problems.join("\n"),
    );
  });

  test("code colours too alike for colour-blind readers (strings and None in 0.2.9)", () => {
    const problems = checkPalette({ ...colorMapping, string: "#ADB26B", nullable: "#FF7979" });
    assert.ok(
      problems.some((p) => p.includes("string #ADB26B") && p.includes("with colour blindness")),
      problems.join("\n"),
    );
  });

  test("brackets and quotes too alike on thin punctuation", () => {
    const problems = checkPalette({
      ...colorMapping,
      typeAnnotation: "#B38F4C",
      punctuation: "#B1775B",
    });
    assert.ok(
      problems.some((p) => p.includes("thin punctuation")),
      problems.join("\n"),
    );
  });

  test("first-level brackets drawn like the punctuation beside them", () => {
    const [theme] = generated;
    const colors = {
      ...theme.theme.colors,
      "editorBracketHighlight.foreground1": colorMapping.punctuation,
    };
    const problems = checkTheme({ ...theme, theme: { ...theme.theme, colors } });
    assert.ok(
      problems.some((p) => p.startsWith("distinct: editorBracketHighlight.foreground1")),
      problems.join("\n"),
    );
  });

  test("a focus outline too faint to see", () => {
    const [theme] = generated;
    const colors = { ...theme.theme.colors, focusBorder: `${colorMapping.accentPrimary}30` };
    const problems = checkTheme({ ...theme, theme: { ...theme.theme, colors } });
    assert.ok(
      problems.some((p) => p.startsWith("contrast: focusBorder")),
      problems.join("\n"),
    );
  });

  test("a documented state left to the editor's default", () => {
    const [theme] = generated;
    const colors = { ...theme.theme.colors };
    delete colors["quickInputList.focusForeground"];
    const problems = checkTheme({ ...theme, theme: { ...theme.theme, colors } });
    assert.ok(problems.some((p) => p.startsWith("state: quickInputList.focusBackground")));
  });

  test("unreadable text", () => {
    assert.ok(broken({ string: colorMapping.background }).some((p) => p.startsWith("contrast:")));
  });
});

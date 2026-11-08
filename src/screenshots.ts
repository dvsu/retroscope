// Renders the README screenshots: yarn screenshots
//
// Each shot is real code highlighted by Shiki with a generated theme, in a
// small editor frame (tabs, line numbers, status bar) drawn with the theme's
// own interface colours, then captured by headless Chrome. Brackets are
// coloured by nesting level, as editors draw them by default. Rerun after any
// colour change; the images live in assets/screenshots and are not packaged.
// The language grid uses Devicon logos (MIT), pinned to a release.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type BundledLanguage, createHighlighter } from "shiki";
import { LANGUAGE_NAMES } from "./coverage";
import { generateTheme } from "./generate";
import { DEVICON, LANGUAGES_IMAGE_LIST, LOGOS } from "./language-logos";
import { themes } from "./themes";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets", "screenshots");
const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SAMPLES: Record<string, { file: string; lang: BundledLanguage; code: string }> = {
  typescript: {
    file: "orders.ts",
    lang: "typescript",
    code: `import { readFile } from "node:fs/promises";

type Status = "pending" | "shipped" | "returned";

interface Order {
  id: number;
  customer: string;
  total: number;
  status: Status;
  shippedAt?: Date;
}

// Sums every shipped order, rounded to cents.
export async function shippedRevenue(path: string): Promise<number> {
  const orders: Order[] = JSON.parse(await readFile(path, "utf8"));
  const total = orders
    .filter((order) => order.status === "shipped")
    .reduce((sum, { total }) => sum + total, 0);
  return Math.round(total * 100) / 100;
}

export const isLate = (order: Order, days = 7): boolean =>
  order.status === "pending" && order.shippedAt === undefined && days > 3;`,
  },
  python: {
    file: "inventory.py",
    lang: "python",
    code: `from dataclasses import dataclass, field
from decimal import Decimal


@dataclass
class Item:
    """A product line in the warehouse."""

    sku: str
    price: Decimal
    stock: int = 0
    tags: list[str] = field(default_factory=list)

    @property
    def value(self) -> Decimal:
        return self.price * self.stock


def restock(items: list[Item], threshold: int = 5) -> dict[str, int]:
    # Order enough to reach twice the threshold.
    return {
        item.sku: threshold * 2 - item.stock
        for item in items
        if item.stock < threshold and "discontinued" not in item.tags
    }`,
  },
  go: {
    file: "server.go",
    lang: "go",
    code: `package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type Health struct {
	Status  string        \`json:"status"\`
	Uptime  time.Duration \`json:"uptime"\`
	Version string        \`json:"version,omitempty"\`
}

var started = time.Now()

func health(w http.ResponseWriter, r *http.Request) {
	body := Health{Status: "ok", Uptime: time.Since(started)}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Printf("health: %v", err)
	}
}`,
  },
  rust: {
    file: "parse.rs",
    lang: "rust",
    code: `use std::collections::HashMap;
use std::str::FromStr;

#[derive(Debug, Clone, PartialEq)]
pub enum Value {
    Number(f64),
    Text(String),
    Missing,
}

impl FromStr for Value {
    type Err = std::convert::Infallible;

    fn from_str(raw: &str) -> Result<Self, Self::Err> {
        Ok(match raw.trim() {
            "" => Value::Missing,
            s => s.parse().map(Value::Number).unwrap_or(Value::Text(s.into())),
        })
    }
}

pub fn parse_row(header: &[&str], line: &str) -> HashMap<String, Value> {
    header.iter().zip(line.split(',')).map(|(k, v)| (k.to_string(), v.parse().unwrap())).collect()
}`,
  },
};

/** Which shots to take: every theme in TypeScript, and more languages in Retroscope. */
const SHOTS: [themeId: string, sample: string][] = [
  ["retroscope", "typescript"],
  ["retroscope", "python"],
  ["retroscope", "go"],
  ["retroscope", "rust"],
  ["retroscope-high-contrast", "typescript"],
  ["retroscope-soft", "typescript"],
];

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const generated = themes.map(generateTheme);
const highlighter = await createHighlighter({
  themes: generated.map((g) => ({ ...g.theme, name: g.metadata.id })),
  langs: Object.values(SAMPLES).map((s) => s.lang),
});

const page = (themeId: string, sampleId: string): string => {
  const g = generated.find((t) => t.metadata.id === themeId);
  const sample = SAMPLES[sampleId];
  if (!g || !sample) throw new Error(`unknown shot ${themeId}/${sampleId}`);
  const c = g.theme.colors;
  const bracketColours = [1, 2, 3, 4, 5, 6].map((n) => c[`editorBracketHighlight.foreground${n}`]);
  const { tokens } = highlighter.codeToTokens(sample.code, {
    lang: sample.lang,
    theme: themeId,
    includeExplanation: true,
  });
  let depth = 0;
  const current = 13;
  const rows = tokens
    .map((line, i) => {
      let html = "";
      for (const token of line) {
        for (const part of token.explanation ?? []) {
          const inText = part.scopes.some((s) => /^(string|comment)/.test(s.scopeName));
          for (const ch of inText ? [part.content] : [...part.content]) {
            let colour = token.color;
            if (!inText && "([{".includes(ch)) colour = bracketColours[depth++ % 6];
            else if (!inText && ")]}".includes(ch)) {
              depth = Math.max(0, depth - 1);
              colour = bracketColours[depth % 6];
            }
            const style = token.fontStyle === 1 ? "font-style:italic;" : "";
            html += `<span style="${style}color:${colour}">${escapeHtml(ch)}</span>`;
          }
        }
      }
      const active = i + 1 === current;
      const number =
        c[active ? "editorLineNumber.activeForeground" : "editorLineNumber.foreground"];
      const highlight = active ? ` style="background:${c["editor.lineHighlightBackground"]}"` : "";
      return `<div class="row"${highlight}><span class="ln" style="color:${number}">${i + 1}</span><span>${html || " "}</span></div>`;
    })
    .join("");
  const tab = (label: string, active: boolean) =>
    `<span class="tab" style="background:${c[active ? "tab.activeBackground" : "tab.inactiveBackground"]};color:${c[active ? "tab.activeForeground" : "tab.inactiveForeground"]};border-right:1px solid ${c["tab.border"]}">${label}</span>`;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;1,400&display=block">
<style>
html,body{margin:0;background:${c["editor.background"]}}
.editor{width:1000px;font:15px/1.65 "JetBrains Mono",ui-monospace,Menlo,monospace;color:${c["editor.foreground"]};background:${c["editor.background"]}}
.tabs{display:flex;background:${c["editorGroupHeader.tabsBackground"]};border-bottom:1px solid ${c["editorGroup.border"]}}
.tab{padding:9px 18px;font-size:13px}
.code{padding:12px 0 16px}
.row{display:flex;white-space:pre}
.ln{width:3.4em;text-align:right;padding-right:1.4em;flex:none}
.status{display:flex;gap:20px;padding:4px 14px;font-size:12.5px;background:${c["statusBar.background"]};color:${c["statusBar.foreground"]};border-top:1px solid ${c["panel.border"]}}
</style></head><body><div class="editor">
<div class="tabs">${tab(sample.file, true)}${tab("README.md", false)}${tab("package.json", false)}</div>
<div class="code">${rows}</div>
<div class="status"><span>main</span><span>Ln ${current}, Col 1</span><span style="margin-left:auto">${g.metadata.displayName}</span></div>
</div></body></html>`;
};

/**
 * A grid of the tested languages' logos, on the Retroscope background. Each
 * logo sits on a light tile, since several (Rust, Markdown, JSON) are dark.
 */
const languagesPage = (): { html: string; height: number } => {
  const base = generated[0];
  if (!base) throw new Error("no theme");
  const c = base.theme.colors;
  const langs = Object.entries(LANGUAGE_NAMES).sort(([, a], [, b]) => a.localeCompare(b));
  const tiles = langs
    .map(([id, name]) => {
      const logo = LOGOS[id];
      const mark = logo
        ? `<img src="${DEVICON}/${logo}/${logo}-original.svg" alt="">`
        : `<span class="word">${name}</span>`;
      return `<div class="tile"><span class="chip">${mark}</span><span class="name">${name}</span></div>`;
    })
    .join("");
  const rows = Math.ceil(langs.length / 7);
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=block">
<style>
html,body{margin:0;background:${c["editor.background"]}}
.grid{width:1000px;box-sizing:border-box;padding:24px;display:grid;grid-template-columns:repeat(7,1fr);gap:20px 8px;font-family:"JetBrains Mono",ui-monospace,Menlo,monospace}
.tile{display:grid;justify-items:center;gap:10px}
.chip{width:64px;height:64px;border-radius:12px;background:#EFE4D6;display:grid;place-items:center}
.chip img{width:42px;height:42px}
.word{font-size:13px;font-weight:600;color:${c["editor.background"]}}
.name{font-size:13px;color:${c["editor.foreground"]}}
</style></head><body><div class="grid">${tiles}</div></body></html>`;
  return { html, height: 48 + rows * 96 + (rows - 1) * 20 };
};

const capture = (html: string, file: string, height: number, tmp: string) => {
  const source = path.join(tmp, `${path.basename(file, ".png")}.html`);
  fs.writeFileSync(source, html);
  const out = path.join(outDir, file);
  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=2",
      `--window-size=1000,${height}`,
      "--virtual-time-budget=6000",
      `--screenshot=${out}`,
      `file://${source}`,
    ],
    { stdio: "ignore" },
  );
  console.log(`wrote ${path.relative(root, out)}`);
};

fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "retroscope-shots-"));
try {
  for (const [themeId, sampleId] of SHOTS) {
    const lines = SAMPLES[sampleId]?.code.split("\n").length ?? 0;
    const height = Math.ceil(36 + 28 + lines * 24.75 + 26);
    capture(page(themeId, sampleId), `${themeId}-${sampleId}.png`, height, tmp);
  }
  const languages = languagesPage();
  capture(languages.html, "languages.png", languages.height, tmp);
  // Record which languages the image shows, so a test can spot a stale image.
  const shown = Object.values(LANGUAGE_NAMES).sort((a, b) => a.localeCompare(b));
  fs.writeFileSync(path.join(root, LANGUAGES_IMAGE_LIST), `${JSON.stringify(shown, null, 2)}\n`);
} finally {
  highlighter.dispose();
  fs.rmSync(tmp, { recursive: true, force: true });
}

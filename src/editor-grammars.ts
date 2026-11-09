// Records how the grammars that editor extensions ship label our demo files:
// yarn editor-grammars
//
// Editors do not all colour a language with the grammar the tests use. Kotlin
// comes from mathiasfrohlich's extension in VS Code and Cursor and from
// JetBrains' in Antigravity, and Java from Red Hat's. Those grammars are not
// copied here (one is not open source); only the scopes they give each piece
// of our own demo files are, so the tests can colour them with the theme.
// Rerun after editing a demo file or updating one of these extensions. Needs
// the extensions installed in VS Code, Cursor or Antigravity, and macOS.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type BundledLanguage, createHighlighter, type LanguageRegistration } from "shiki";
import { sha256 } from "./semantic-capture";
import type { GrammarRecording } from "./textmate";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const RECORDINGS_DIR = path.join(root, "src", "fixtures", "textmate");

/** Editor grammars to record, by recording id. */
export const EDITOR_GRAMMARS: Record<
  string,
  { extension: RegExp; grammar: string; language: string; demo: string; editors: string }
> = {
  "kotlin-jetbrains": {
    extension: /^jetbrains\.kotlin-server-\d/,
    grammar: "syntaxes/kotlin.tmLanguage.json",
    language: "kotlin",
    demo: "demo/demo.kt",
    editors: "JetBrains' Kotlin extension (Antigravity here)",
  },
  "kotlin-mathiasfrohlich": {
    extension: /^mathiasfrohlich\.kotlin-\d/,
    grammar: "syntaxes/Kotlin.tmLanguage",
    language: "kotlin",
    demo: "demo/demo.kt",
    editors: "mathiasfrohlich's Kotlin extension (VS Code and Cursor here)",
  },
  "java-redhat": {
    extension: /^redhat\.java-\d/,
    grammar: "language-support/java/java.tmLanguage.json",
    language: "java",
    demo: "demo/demo.java",
    editors: "Red Hat's Java extension",
  },
};

export const loadRecording = (id: string): GrammarRecording =>
  JSON.parse(fs.readFileSync(path.join(RECORDINGS_DIR, `${id}.json`), "utf8"));

/** The newest install of an extension across the editors, holding `needs` if given. */
export const findExtension = (pattern: RegExp, needs?: string): string | undefined => {
  const dirs = [".vscode", ".cursor", ".antigravity-ide", ".antigravity"].map((d) =>
    path.join(os.homedir(), d, "extensions"),
  );
  return dirs
    .filter((d) => fs.existsSync(d))
    .flatMap((d) =>
      fs
        .readdirSync(d)
        .filter((e) => pattern.test(e))
        .map((e) => path.join(d, e)),
    )
    .filter((e) => !needs || fs.existsSync(path.join(e, needs)))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true }))
    .pop();
};

const readGrammar = (file: string): LanguageRegistration =>
  file.endsWith(".json")
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : JSON.parse(
        execFileSync("plutil", ["-convert", "json", "-o", "-", file], { encoding: "utf8" }),
      );

const record = async () => {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
  for (const [id, spec] of Object.entries(EDITOR_GRAMMARS)) {
    const dir = findExtension(spec.extension);
    if (!dir) {
      console.warn(`skipped ${id}: extension not installed`);
      continue;
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
    const name = `recorded-${id}`;
    const grammar = { ...readGrammar(path.join(dir, spec.grammar)), name, embeddedLangs: [] };
    const highlighter = await createHighlighter({ themes: ["min-dark"], langs: [grammar] });
    const source = fs.readFileSync(path.join(root, spec.demo), "utf8");
    try {
      const { tokens } = highlighter.codeToTokens(source, {
        lang: name as BundledLanguage,
        theme: "min-dark",
        includeExplanation: true,
      });
      const lineStarts = [0];
      for (let i = 0; i < source.length; i++) if (source[i] === "\n") lineStarts.push(i + 1);
      const pieces: GrammarRecording["pieces"] = [];
      tokens.forEach((line, lineNumber) => {
        for (const token of line) {
          let character = token.offset - (lineStarts[lineNumber] ?? 0);
          for (const part of token.explanation ?? []) {
            pieces.push({
              line: lineNumber,
              character,
              text: part.content,
              scopes: part.scopes.map((s) => s.scopeName),
            });
            character += part.content.length;
          }
        }
      });
      const recording: GrammarRecording = {
        extension: `${manifest.publisher}.${manifest.name} ${manifest.version}`,
        language: spec.language,
        source: spec.demo,
        sourceSha256: sha256(source),
        pieces,
      };
      fs.writeFileSync(path.join(RECORDINGS_DIR, `${id}.json`), `${JSON.stringify(recording)}\n`);
      console.log(`wrote ${id}: ${pieces.length} pieces from ${recording.extension}`);
    } finally {
      highlighter.dispose();
    }
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) await record();

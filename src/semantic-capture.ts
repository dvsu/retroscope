// Records the semantic tokens language servers give our demo files:
// yarn semantic-tokens [language]
//
// With semantic highlighting, an editor colours code with these tokens on
// top of the TextMate grammar, so the tests check that both give the same
// colours. The servers and their token types come from the extensions
// installed in VS Code, Cursor or Antigravity; rerun this after editing a
// demo file or updating one of these extensions. Each file is opened on its
// own, without a project, so only what it declares (and, for Java, the JDK)
// is resolved.
import { type ChildProcess, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findExtension } from "./editor-grammars";
import type { SemanticLegend } from "./semantic";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SEMANTIC_DIR = path.join(root, "src", "fixtures", "semantic");

export type SemanticFixture = {
  source: string;
  /** SHA-256 of the source when the tokens were recorded. */
  sourceSha256: string;
  extension: string;
  /** What editors with this server colour the rest with: the bundled grammar or a recording. */
  textMate: "bundled" | string;
  legend: SemanticLegend;
  tokens: { line: number; character: number; length: number; type: string; modifiers: string[] }[];
};

export const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");

const newest = (dir: string, pattern: RegExp): string | undefined =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((d) => pattern.test(d))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((d) => path.join(dir, d))
        .pop()
    : undefined;

type Server = {
  extension: RegExp;
  /** A file the extension install must contain (some installs fetch the server later). */
  needs?: string;
  demo: string;
  textMate: SemanticFixture["textMate"];
  /** Starts the server for a workspace holding a copy of the demo file. */
  start: (extension: string, workspace: string) => ChildProcess;
};

export const SERVERS: Record<string, Server> = {
  csharp: {
    extension: /^ms-dotnettools\.csharp-\d/,
    demo: "demo/demo.cs",
    textMate: "bundled",
    start: (extension, workspace) => {
      const runtimes = path.join(
        os.homedir(),
        "Library/Application Support/Code/User/globalStorage/ms-dotnettools.vscode-dotnet-runtime/.dotnet",
      );
      const runtime = newest(runtimes, /^\d/);
      const dotnet = process.env.DOTNET ?? (runtime && path.join(runtime, "dotnet"));
      if (!dotnet || !fs.existsSync(dotnet)) throw new Error("no .NET runtime: set DOTNET");
      const server = path.join(extension, ".roslyn", "Microsoft.CodeAnalysis.LanguageServer.dll");
      return spawn(dotnet, [
        server,
        "--stdio",
        "--logLevel",
        "Warning",
        "--extensionLogDirectory",
        workspace,
      ]);
    },
  },
  java: {
    extension: /^redhat\.java-\d/,
    demo: "demo/demo.java",
    textMate: "java-redhat",
    start: (extension, workspace) => {
      const server = path.join(extension, "server");
      const launcher = newest(
        path.join(server, "plugins"),
        /^org\.eclipse\.equinox\.launcher_.*\.jar$/,
      );
      const jre = newest(path.join(extension, "jre"), /./);
      if (!launcher || !jre) throw new Error("the Java extension has no bundled server or runtime");
      const config = path.join(workspace, ".config");
      fs.cpSync(
        path.join(server, process.arch === "arm64" ? "config_mac_arm" : "config_mac"),
        config,
        {
          recursive: true,
        },
      );
      return spawn(path.join(jre, "bin", "java"), [
        "-Declipse.application=org.eclipse.jdt.ls.core.id1",
        "-Dosgi.bundles.defaultStartLevel=4",
        "-Declipse.product=org.eclipse.jdt.ls.core.product",
        "-Xmx1G",
        "--add-modules=ALL-SYSTEM",
        "--add-opens",
        "java.base/java.util=ALL-UNNAMED",
        "--add-opens",
        "java.base/java.lang=ALL-UNNAMED",
        "-jar",
        launcher,
        "-configuration",
        config,
        "-data",
        path.join(workspace, ".data"),
      ]);
    },
  },
  kotlin: {
    extension: /^jetbrains\.kotlin-server-\d/,
    needs: "server/bin/intellij-server",
    demo: "demo/demo.kt",
    textMate: "kotlin-jetbrains",
    start: (extension, workspace) =>
      spawn(path.join(extension, "server", "bin", "intellij-server"), ["--stdio"], {
        cwd: workspace,
      }),
  },
};

const STANDARD_TYPES = [
  "namespace",
  "type",
  "class",
  "enum",
  "interface",
  "struct",
  "typeParameter",
  "parameter",
  "variable",
  "property",
  "enumMember",
  "event",
  "function",
  "method",
  "macro",
  "keyword",
  "modifier",
  "comment",
  "string",
  "number",
  "regexp",
  "operator",
  "decorator",
  "label",
];
const STANDARD_MODIFIERS = [
  "declaration",
  "definition",
  "readonly",
  "static",
  "deprecated",
  "abstract",
  "async",
  "modification",
  "documentation",
  "defaultLibrary",
];

const capture = async (language: string) => {
  const spec = SERVERS[language];
  if (!spec) throw new Error(`no server for ${language}`);
  const extension = findExtension(spec.extension, spec.needs);
  if (!extension)
    throw new Error(`install the ${language} extension in VS Code, Cursor or Antigravity`);
  const manifest = JSON.parse(fs.readFileSync(path.join(extension, "package.json"), "utf8"));
  const contributes = manifest.contributes ?? {};
  const legend: SemanticLegend = {
    language,
    superTypes: Object.fromEntries(
      (contributes.semanticTokenTypes ?? [])
        .filter((t: { superType?: string }) => t.superType)
        .map((t: { id: string; superType: string }) => [t.id, t.superType]),
    ),
    scopes:
      (contributes.semanticTokenScopes ?? []).find(
        (s: { language?: string }) => s.language === language,
      )?.scopes ?? {},
  };

  const workspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `${language}-server-`)));
  const sourcePath = path.join(root, spec.demo);
  const text = fs.readFileSync(sourcePath, "utf8");
  const file = path.join(workspace, path.basename(spec.demo));
  fs.writeFileSync(file, text);
  const server = spec.start(extension, workspace);
  server.stderr?.resume();
  let nextId = 0;
  const pending = new Map<number, (result: unknown) => void>();
  const send = (message: object) => {
    const body = JSON.stringify({ jsonrpc: "2.0", ...message });
    server.stdin?.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
  };
  const request = <T>(method: string, params: object) =>
    new Promise<T>((resolve) => {
      const id = ++nextId;
      pending.set(id, resolve as (result: unknown) => void);
      send({ id, method, params });
    });
  let buffer = Buffer.alloc(0);
  server.stdout?.on("data", (chunk: Buffer) => {
    buffer = Buffer.concat([buffer, chunk]);
    for (;;) {
      const end = buffer.indexOf("\r\n\r\n");
      if (end < 0) return;
      const length = Number(/Content-Length: (\d+)/.exec(buffer.subarray(0, end).toString())?.[1]);
      if (buffer.length < end + 4 + length) return;
      const message = JSON.parse(buffer.subarray(end + 4, end + 4 + length).toString());
      buffer = buffer.subarray(end + 4 + length);
      if (message.method && message.id !== undefined) {
        // Server-to-client requests: answer with defaults.
        const items = message.params?.items;
        send({ id: message.id, result: Array.isArray(items) ? items.map(() => null) : null });
      } else if (message.id !== undefined) {
        pending.get(message.id)?.(message.result);
        pending.delete(message.id);
      }
    }
  });

  try {
    const init = await request<{
      capabilities: {
        semanticTokensProvider: { legend: { tokenTypes: string[]; tokenModifiers: string[] } };
      };
    }>("initialize", {
      processId: process.pid,
      rootUri: `file://${workspace}`,
      workspaceFolders: [{ uri: `file://${workspace}`, name: language }],
      initializationOptions: { settings: { java: { semanticHighlighting: { enabled: true } } } },
      capabilities: {
        workspace: { configuration: true, workspaceFolders: true },
        textDocument: {
          synchronization: {},
          semanticTokens: {
            requests: { full: true },
            tokenTypes: STANDARD_TYPES,
            tokenModifiers: STANDARD_MODIFIERS,
            formats: ["relative"],
          },
        },
      },
    });
    const { tokenTypes, tokenModifiers } = init.capabilities.semanticTokensProvider.legend;
    send({ method: "initialized", params: {} });
    const uri = `file://${file}`;
    send({
      method: "textDocument/didOpen",
      params: { textDocument: { uri, languageId: language, version: 1, text } },
    });

    // The first answers can come before the file is fully analysed: wait
    // until the same tokens come back twice in a row.
    let data: number[] = [];
    let previous = "";
    for (let attempt = 0; attempt < 40; attempt++) {
      await new Promise((r) => setTimeout(r, 3000));
      const result = await request<{ data: number[] } | null>("textDocument/semanticTokens/full", {
        textDocument: { uri },
      });
      data = result?.data ?? [];
      const key = data.join(",");
      if (attempt >= 2 && data.length > 0 && key === previous) break;
      previous = key;
    }

    const tokens: SemanticFixture["tokens"] = [];
    let line = 0;
    let character = 0;
    for (let i = 0; i + 4 < data.length; i += 5) {
      const [dLine = 0, dChar = 0, length = 0, type = 0, mods = 0] = data.slice(i, i + 5);
      line += dLine;
      character = dLine ? dChar : character + dChar;
      tokens.push({
        line,
        character,
        length,
        type: tokenTypes[type] ?? "unknown",
        modifiers: tokenModifiers.filter((_, bit) => mods & (1 << bit)),
      });
    }
    const fixture: SemanticFixture = {
      source: spec.demo,
      sourceSha256: sha256(text),
      extension: `${manifest.publisher}.${manifest.name} ${manifest.version}`,
      textMate: spec.textMate,
      legend,
      tokens,
    };
    const out = path.join(SEMANTIC_DIR, `${language}.json`);
    fs.mkdirSync(SEMANTIC_DIR, { recursive: true });
    fs.writeFileSync(out, `${JSON.stringify(fixture, null, 1)}\n`);
    console.log(`wrote ${path.relative(root, out)}: ${tokens.length} tokens`);
  } finally {
    const exited = new Promise((resolve) => server.once("exit", resolve));
    server.kill();
    await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 10000))]);
    fs.rmSync(workspace, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const wanted = process.argv[2];
  for (const language of wanted ? [wanted] : Object.keys(SERVERS)) await capture(language);
  process.exit(0);
}

// Lists where code looks different with semantic highlighting on and off:
// yarn semantic [language] [theme-id] [--other-extensions]
import { generateTheme } from "./generate";
import { SEMANTIC_LANGUAGES, semanticDifferencesFor } from "./semantic-fixture";
import { themes } from "./themes";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const languages = SEMANTIC_LANGUAGES.filter((l) => !args[0] || l === args[0]);
const wanted =
  args.find((a) => !(SEMANTIC_LANGUAGES as readonly string[]).includes(a)) ?? "retroscope";
const module = themes.find((t) => t.create().metadata.id === wanted);
if (!module) throw new Error(`no theme ${wanted}`);
for (const language of languages) {
  const { differences, allowed } = await semanticDifferencesFor(
    language,
    generateTheme(module).theme,
    process.argv.includes("--other-extensions"),
  );
  const row = (d: (typeof differences)[number]) =>
    `${String(d.token.line + 1).padStart(4)}  ${JSON.stringify(d.text).padEnd(22)} ${(d.token.type + d.token.modifiers.map((m) => `.${m}`).join("")).padEnd(28)} ${d.semantic.foreground ?? "-"}${d.semantic.italic ? " italic" : ""}  vs  ${d.textMate.foreground}${d.textMate.italic ? " italic" : ""} ${d.textMate.scope}`;
  console.log(`== ${language}: unexpected differences (${differences.length})`);
  for (const d of differences) console.log(row(d));
  console.log(`   known (${allowed.length})`);
  for (const d of allowed) console.log(row(d));
}

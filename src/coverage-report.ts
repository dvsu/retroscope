// Prints which pieces of each sample no theme rule colours: yarn coverage
// Pass a language id to see every uncovered scope for it: yarn coverage python
import { measureCoverage, unruledLabels } from "./coverage";
import { generateTheme } from "./generate";
import { themes } from "./themes";

const only = process.argv[2];

for (const module of themes) {
  const { metadata, theme } = generateTheme(module);
  const results = await measureCoverage(theme);
  console.log(`\n${metadata.displayName}: pieces of code only the catch-all rule colours`);
  console.log("  unstyled = labelled by the grammar but matched by no rule (fix these)");
  console.log(
    "  unlabelled = the grammar labels nothing more specific (takes the catch-all colour)\n",
  );
  for (const r of results) {
    if (only && r.lang !== only) continue;
    const pct = ((1 - r.uncovered / r.pieces) * 100).toFixed(1).padStart(5);
    const unlabelled = r.uncovered - r.unstyled;
    console.log(
      `${r.lang.padEnd(12)} ${pct}% covered  ${String(r.unstyled).padStart(3)} unstyled  ${String(unlabelled).padStart(3)} unlabelled  of ${r.pieces}`,
    );
    for (const g of r.byScope.slice(0, only ? undefined : 4)) {
      const examples = g.examples.map((e) => JSON.stringify(e)).join(" ");
      console.log(
        `    ${String(g.count).padStart(3)}  ${g.kind.padEnd(10)}  ${g.scope}  ${examples}`,
      );
    }
  }
  const unruled = (await unruledLabels(theme)).filter((r) => !only || r.lang === only);
  const count = unruled.reduce((n, r) => n + r.labels.length, 0);
  console.log(`\nLabels the grammars declare with no colour rule: ${count}`);
  for (const r of unruled) {
    for (const label of r.labels) console.log(`  ${r.lang.padEnd(12)} ${label}`);
  }
}

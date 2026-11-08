// Fails unless the extension package contains the expected files and rewrites
// README images and links cleanly for marketplaces and editor webviews.
// Packaging uses the `files` allowlist in package.json; update EXPECTED deliberately.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { inflateRawSync } from "node:zlib";

const EXPECTED = [
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "assets/retroscope_255x255.png",
  "package.json",
  "themes/retroscope-amber-color-theme.json",
  "themes/retroscope-cassette-color-theme.json",
  "themes/retroscope-color-theme.json",
  "themes/retroscope-high-contrast-color-theme.json",
  "themes/retroscope-phosphor-color-theme.json",
  "themes/retroscope-soft-color-theme.json",
];

const RAW_IMAGES_PREFIX = "https://raw.githubusercontent.com/dvsu/retroscope/";

function extractImages(markdown: string): string[] {
  return [
    ...[...markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]),
    ...[...markdown.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((m) => m[1]),
  ];
}

function extractLinks(markdown: string): string[] {
  return [
    ...[...markdown.matchAll(/(?<!!)\[(?:[^[\]]|!\[[^\]]*\]\([^)]*\))*\]\(([^)\s]+)\)/g)].map(
      (m) => m[1],
    ),
    ...[...markdown.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].map((m) => m[1]),
  ];
}

function isExternalOrAnchor(url: string): boolean {
  return /^https:\/\//i.test(url) || /^mailto:/i.test(url) || url.startsWith("#");
}

function readZipEntry(zipPath: string, entryName: string): string {
  const buf = fs.readFileSync(zipPath);
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error(`not a zip archive: ${zipPath}`);

  const cdSize = buf.readUInt32LE(eocd + 12);
  const cdOffset = buf.readUInt32LE(eocd + 16);
  let pos = cdOffset;
  while (pos < cdOffset + cdSize) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) {
      throw new Error(`corrupt zip central directory at ${pos}`);
    }
    const method = buf.readUInt16LE(pos + 10);
    const compressedSize = buf.readUInt32LE(pos + 20);
    const nameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);
    const localOffset = buf.readUInt32LE(pos + 42);
    const name = buf.subarray(pos + 46, pos + 46 + nameLen).toString("utf8");

    if (name === entryName) {
      if (buf.readUInt32LE(localOffset) !== 0x04034b50) {
        throw new Error(`corrupt zip local header at ${localOffset}`);
      }
      const localNameLen = buf.readUInt16LE(localOffset + 26);
      const localExtraLen = buf.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + localNameLen + localExtraLen;
      const raw = buf.subarray(dataStart, dataStart + compressedSize);
      if (method === 0) return raw.toString("utf8");
      if (method === 8) return inflateRawSync(raw).toString("utf8");
      throw new Error(`unsupported zip compression method ${method} for ${entryName}`);
    }
    pos += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error(`missing ${entryName} in ${zipPath}`);
}

const errors: string[] = [];

// 1. Check packaged file allowlist.
const output = execFileSync("vsce", ["ls", "--no-dependencies"], { encoding: "utf8" });
const actual = output
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("INFO") && !line.startsWith("WARNING"))
  .sort();

for (const file of actual.filter((f) => !EXPECTED.includes(f))) {
  errors.push(`unexpected in package: ${file}`);
}
for (const file of EXPECTED.filter((f) => !actual.includes(f))) {
  errors.push(`missing from package: ${file}`);
}

// 2. Check source README relative assets exist and HTML <a href> links are not relative
//    (vsce rewrites Markdown links and <img src>, never HTML <a href>).
const sourceReadme = fs.readFileSync("README.md", "utf8");
const sourceRelativeImages = extractImages(sourceReadme).filter((u) => !isExternalOrAnchor(u));
if (sourceRelativeImages.length === 0) {
  errors.push("README.md has no relative repository images");
}
for (const rel of sourceRelativeImages) {
  const clean = rel.split(/[?#]/)[0];
  if (!fs.existsSync(clean)) {
    errors.push(`README.md references missing image: ${rel}`);
  }
}
for (const match of sourceReadme.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
  if (!isExternalOrAnchor(match[1])) {
    errors.push(`README.md HTML <a href="${match[1]}"> will not be rewritten by vsce`);
  }
}

// 3. Package a temporary VSIX and verify extension/readme.md image and link URLs.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "retroscope-pkg-"));
try {
  const vsixPath = path.join(tmpDir, "retroscope-check.vsix");
  execFileSync("yarn", ["package:vsix", "--out", vsixPath], { encoding: "utf8" });
  const packagedReadme = readZipEntry(vsixPath, "extension/readme.md");

  const packagedImages = extractImages(packagedReadme);
  const rawRepoImages = packagedImages.filter((u) => u.startsWith(RAW_IMAGES_PREFIX));
  if (rawRepoImages.length !== sourceRelativeImages.length) {
    errors.push(
      `expected ${sourceRelativeImages.length} images under ${RAW_IMAGES_PREFIX}, got ${rawRepoImages.length}`,
    );
  }
  for (const img of packagedImages) {
    if (!/^https:\/\//i.test(img)) {
      errors.push(`packaged README image is not https: ${img}`);
    }
    if (/^https:\/\/github\.com\/[^/]+\/[^/]+\/raw\//i.test(img)) {
      errors.push(`packaged README image uses github.com/raw redirector instead of CDN: ${img}`);
    }
  }
  for (const link of extractLinks(packagedReadme)) {
    if (!isExternalOrAnchor(link)) {
      errors.push(`packaged README has unrewritten relative link: ${link}`);
    }
  }
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

if (errors.length > 0) {
  for (const err of errors) console.error(err);
  process.exit(1);
}
console.log(
  `package contents ok (${actual.length} files, ${sourceRelativeImages.length} CDN images)`,
);

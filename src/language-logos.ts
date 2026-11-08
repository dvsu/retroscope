/**
 * Devicon logo for each tested language, used by `yarn screenshots` for the
 * README's language grid (Devicon is MIT, pinned to a release). Undefined
 * means a plain text tile: TOML has no logo, and SQL has only brand logos
 * such as MySQL. Every language in LANGUAGE_NAMES needs an entry here.
 */
export const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";

export const LOGOS: Record<string, string | undefined> = {
  c: "c",
  cpp: "cplusplus",
  csharp: "csharp",
  css: "css3",
  dart: "dart",
  docker: "docker",
  go: "go",
  html: "html5",
  java: "java",
  javascript: "javascript",
  json: "json",
  kotlin: "kotlin",
  lua: "lua",
  markdown: "markdown",
  php: "php",
  python: "python",
  ruby: "ruby",
  rust: "rust",
  scss: "sass",
  shellscript: "bash",
  sql: undefined,
  swift: "swift",
  toml: undefined,
  tsx: "react",
  typescript: "typescript",
  yaml: "yaml",
};

/** The languages the generated image shows, written by `yarn screenshots`. */
export const LANGUAGES_IMAGE_LIST = "assets/screenshots/languages.json";

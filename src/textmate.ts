// Colours code the way an editor's TextMate engine does, from scopes that
// were recorded with the grammar an editor extension ships (see
// src/editor-grammars.ts). Those grammars are not part of this repository;
// only what they label our demo files with is.
import { Theme } from "@shikijs/vscode-textmate";
import type { TextMatePiece } from "./semantic";
import type { VSCodeTheme } from "./types";

export type RecordedPiece = { line: number; character: number; text: string; scopes: string[] };

export type GrammarRecording = {
  /** Extension and version the grammar came from. */
  extension: string;
  language: string;
  source: string;
  sourceSha256: string;
  pieces: RecordedPiece[];
};

type ScopeStack = { parent: ScopeStack | null; scopeName: string };

const ITALIC = 1;

/** Colours recorded pieces with a theme, as vscode-textmate does. */
export const colourRecording = (theme: VSCodeTheme, pieces: RecordedPiece[]): TextMatePiece[] => {
  const fg = theme.colors["editor.foreground"] ?? "#000000";
  const bg = theme.colors["editor.background"] ?? "#FFFFFF";
  const engine = Theme.createFromRawTheme({
    name: theme.name,
    settings: [{ settings: { foreground: fg, background: bg } }, ...theme.tokenColors],
  } as Parameters<typeof Theme.createFromRawTheme>[0]);
  const colours = engine.getColorMap();
  const defaults = engine.getDefaults();
  return pieces.map((piece) => {
    let foreground = colours[defaults.foregroundId] ?? fg;
    let fontStyle = defaults.fontStyle;
    let stack: ScopeStack | null = null;
    for (const scopeName of piece.scopes) {
      stack = { parent: stack, scopeName };
      const match = engine.match(stack as Parameters<typeof engine.match>[0]);
      if (!match) continue;
      if (match.foregroundId !== 0) foreground = colours[match.foregroundId] ?? foreground;
      if (match.fontStyle !== -1) fontStyle = match.fontStyle;
    }
    return {
      line: piece.line,
      character: piece.character,
      text: piece.text,
      foreground,
      italic: fontStyle > 0 && (fontStyle & ITALIC) === ITALIC,
      scope: piece.scopes[piece.scopes.length - 1] ?? "",
      scopes: piece.scopes,
    };
  });
};

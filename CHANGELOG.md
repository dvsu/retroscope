# Changelog

## 0.4.1

- Refresh the extension page with screenshots of every theme, the supported languages and install steps for VS Code, Cursor and Antigravity

## 0.4.0

- Add **Retroscope High Contrast**: code text at 7:1 contrast or more (WCAG AAA) on a slightly deeper background, for bright rooms, glare or low vision
- Add **Retroscope Soft**: a lighter, warmer dark theme with gentler contrast, for dim rooms and long evenings
- Set colours for every remaining interface state, such as the highlighted item in the command palette and autocomplete, keyboard focus in lists, unfocused tabs, inlay hints and settings inputs, so they read the same in VS Code, Cursor and Antigravity
- Make the outline of active toggles, such as Match Case in the find box, easier to see
- Make the box behind a matching bracket fainter, so the bracket's own colour reads clearly; the bright outline still marks the match

## 0.3.0

- Improve colour vision accessibility: code colours are rebalanced so each one stays easy to tell apart with typical colour vision as well as with protanopia, deuteranopia and tritanopia
- Dim punctuation slightly, so brackets, commas and quotes recede behind the code
- Draw first-level brackets in orange, so they stand apart from the quotes, commas and colons beside them
- Adjust types, type annotations, declaration keywords such as `def` and `function`, and `None`/`null`/`nil` slightly; error and warning text and the terminal's bright red and yellow follow the same small shift

## 0.2.9

- Fix the matching bracket disappearing in Antigravity: it now keeps its own colour inside a faint box with a bright outline
- Colour every kind of token in 26 common languages, including C, C++, C#, Java, JavaScript, Kotlin, PHP, Ruby, Rust, Swift, SQL, shell, CSS and HTML, which partly fell back to a single colour
- Show invalid code in red and deprecated code struck through
- Style headings, bold, italic, quotes, lists and inline code in Markdown and doc comments
- Make faded text easier to read: comments, line numbers, breadcrumbs, placeholders and unselected tabs are slightly lighter (3:1 contrast)
- Unselected tabs no longer have a tint

## 0.2.8

- Fix unreadable hover states in Antigravity and Cursor, such as bright text on a bright remote indicator in the status bar
- Make find matches readable: dark text on the current match, bright text on the other matches
- Improve contrast of the status bar hover, pressed and debugging states
- Add colours for secondary buttons and for the remote, offline, error and warning items in the status bar

## 0.2.7

- Ship a much smaller package (19 KB instead of 1.1 MB): only the theme, icon, changelog and licence
- Each GitHub Release now carries the published `.vsix` and its SHA-256 checksum

## 0.2.6

- Ignore `node_modules` from bundled package

## 0.2.5

- Upgrade `yarn` to `v4.14.1`
- Minor color fixes:
  - Fix editor UI color to improve visibility

## 0.2.4

- Downgrade `vscode` engine from `^1.109.0` -> `^1.107.0` to be compatible with Antigravity

## 0.2.3

- Fix status bar color of debugging mode

## 0.2.2

- Ensure `.md` color consistency with `.tsx`
- Fix UI colors

## 0.2.1

- Update CHANGELOG

## 0.2.0

- Support `.dart`
- Fix comment block color in `.ts` and `.tsx`

## 0.1.2

- Customize and correct UI theme
- Add screenshot

## 0.1.1

- Fix editor highlight
- Tune colors, add cyan to color palette

## 0.1.0

- Support following languages and file extensions:
  - `.go` (Go)
  - `.json`
  - `.md`
  - `.py` (Python)
  - `.ts`, `.tsx` (TypeScript)
  - `.yml`, `.yaml`
  - `Dockerfile`

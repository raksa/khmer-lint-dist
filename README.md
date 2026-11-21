# Khmer Lint

Khmer language tools for browsers, web workers and Node. The package includes
the Khmer (`km_KH`) Hunspell dictionaries.

- **Spellcheck that understands unspaced Khmer.** A run of dictionary words
  written without breaks is correct, and a misspelled run names the part the
  dictionary doesn't know.
- **Segmentation.** Splits an unspaced run at its dictionary words, joined by
  zero-width spaces.
- **A linter with fixes**:
  - possible misspellings;
  - repeated zero-width characters;
  - optionally, visible spaces between Khmer letters.
- **Text tools.** Zero-width word-break repair, collapsing and removing
  zero-width characters, and Khmer ⇄ Western digits.
- **The NiDA keyboard**:
  - the layout table;
  - recovering text typed in the wrong layout (`xjmEr` ⇄ `ខ្មែរ`);
  - the keystrokes that type a text.

## Install

```bash
npm i khmer-lint
```

## Use

```js
import {
  applyKhmerLintFixes,
  convertQwertyToKhmer,
  toKhmerDigits,
} from 'khmer-lint';
import { createKhmerLinter } from 'khmer-lint/node';

const linter = createKhmerLinter(); // loads the bundled dictionaries
const issues = await linter.lint(text); // 0-based line/start/end, replacements, unknownParts
const { text: fixed } = applyKhmerLintFixes(text, issues);

await linter.segment('ព្រះគុណទ្រង់'); // 'ព្រះគុណ​ទ្រង់'
convertQwertyToKhmer('xjmEr'); // 'ខ្មែរ'
toKhmerDigits('2026'); // '២០២៦'
```

In a browser or worker, run the spellcheck engine itself
(`createKhmerSpellcheckEngine`) on the dictionary files' URLs. The files are
`khmer-lint/dics/km_KH.aff`, `km_KH.dic` and `km_KH-suggest.aff`.

ESM and CommonJS. `khmer-lint/node` needs Node.js 20 or newer.

The full guide covers every function, option and rule:
[`how-to_khmer-lint.md`](./how-to_khmer-lint.md), shipped in this package. For
an MCP server built on it, see
[`khmer-lint-mcp`](https://www.npmjs.com/package/khmer-lint-mcp).

## Build

Run `npm run pack -- khmer-lint` from the repo root. It bundles the sources and
copies the dictionaries into `dist/dics/`. `typo-js` stays an external
dependency.

### Releasing

For maintainers: bump `version` in `package.json`, run
`npm run pack -- khmer-lint`, then `npm run pub -- khmer-lint`. Publish it
before `open-lyric-plugin-km-kh` and `khmer-lint-mcp`, which depend on it.

## License

MIT

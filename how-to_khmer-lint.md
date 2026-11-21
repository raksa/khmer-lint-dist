# khmer-lint — how to use the library

`khmer-lint` is a set of Khmer language tools that run in browsers, web workers
and Node:

- the script rules: character ranges, word patterns, the zero-width word break;
- segmentation of unspaced Khmer into dictionary words;
- a Hunspell spellcheck engine that accepts a run of dictionary words written
  without breaks;
- a linter with fixes;
- zero-width character and digit tools;
- NiDA keyboard conversions;
- the Khmer (`km_KH`) Hunspell dictionaries.

## Install

```bash
npm i khmer-lint
```

ESM and CommonJS. Its one dependency is `typo-js`, the Hunspell reader.
`khmer-lint/node` needs Node.js 20 or newer.

| Import | What it holds |
| --- | --- |
| `khmer-lint` | Everything environment-neutral: no file system, no DOM. The spellcheck engine loads dictionaries with `fetch` unless you give it a loader. |
| `khmer-lint/node` | Node helpers that read the bundled dictionaries from disk, plus a ready-made linter. |
| `khmer-lint/dics/km_KH.aff`, `km_KH.dic`, `km_KH-suggest.aff` | The dictionary files, for a bundler to emit as assets. |

## Khmer text, as these tools see it

- **Word breaks.** Khmer runs its words together. A word break is a zero-width
  space (U+200B, `ZERO_WIDTH_SPACE`): it is invisible, but it lets a line wrap
  between words. A visible space separates phrases, not words. On the NiDA
  keyboard, Space types the zero-width space and Shift+Space a visible one.
- **Runs.** Text is checked in *runs*: the Khmer letters and signs between
  spaces, punctuation and zero-width breaks (`KHMER_WORD_RE`). Unspaced text
  gives long runs.
- **Unspaced words.** A run made of several dictionary words written together
  is spelled correctly. So a run that is flagged always has a part the
  dictionary doesn't know, and for a longer run the linter names that part.
- **Other zero-width characters.** ZWNJ (U+200C) and ZWJ (U+200D) control how
  neighbouring characters join, so the tools keep them. Two or more zero-width
  characters in a row are a slip, and one is enough.

## Quick start (Node)

```js
import { applyKhmerLintFixes } from 'khmer-lint';
import { createKhmerLinter } from 'khmer-lint/node';

const linter = createKhmerLinter(); // starts loading the bundled dictionaries
const issues = await linter.lint(text);
// [{ rule: 'spelling', severity: 'warning', message, line, start, end, text, replacements }]

const { text: fixed, applied } = applyKhmerLintFixes(text, issues);

await linter.checkWords(['ព្រះគុណ', 'ព្រះះ']); // { ព្រះគុណ: true, ព្រះះ: false }
await linter.suggest('ព្រះះ'); // ['ព្រះ', …]
await linter.segment('ព្រះគុណទ្រង់'); // 'ព្រះគុណ​ទ្រង់'
await linter.segmentText(text); // every run split at its dictionary words
```

`createKhmerLinter(options)`:

| Option | Default | Meaning |
| --- | --- | --- |
| `dictionaryDir` | the bundled `dics/` | A folder holding `km_KH.aff` and `km_KH.dic`, plus `km_KH-suggest.aff` when suggestions are on. |
| `suggestions` | `true` | Load the suggestion affix file. |
| `customWords` | none | Words to accept whatever the dictionary says. |

The linter object has these members:

- `ready()` resolves once the dictionaries are loaded, and rejects when they
  cannot be. Every other method waits for it and fails the same way.
- `lint(text, { rules, maxSuggestions, maxIssues })`.
- `checkWords(words)` returns each word mapped to `true` or `false`. Custom
  words always pass.
- `suggest(word, limit = 3)`.
- `segment(word)` returns the run split at the dictionary words it contains,
  joined by U+200B. A stretch the dictionary doesn't know stays one piece. It
  returns `''` when there is nothing to split.
- `segmentText(text)`.
- `engine` is the spellcheck engine underneath.
- `dictionaryDir` is the folder the dictionaries come from.
- `customWords` is a `Set` you can add to.

Loading takes a second or two.

`getKhmerDictionaryDir()` returns the folder of the bundled dictionaries.

## The linter

`lintKhmerText(text, options)` resolves to the issues, sorted by line and
column. It is environment-neutral: pass a spellchecker for the `spelling`
rule.

| Rule | Default | Flags | Replacements |
| --- | --- | --- | --- |
| `spelling` | on | A run that neither the dictionary nor `customWords` knows. A run of known words written without breaks passes. | The dictionary's suggestions, which may be empty. |
| `repeated-zero-width` | on | Two or more zero-width characters (U+200B–U+200D) in a row. | The first of them. |
| `word-separator` | off | Whitespace between two Khmer letters (ZWNJ, no-break and other spaces included). Use it only for text that marks every word break with U+200B, because Khmer prose puts visible spaces between phrases. | U+200B |

`KHMER_LINT_RULES` lists every rule, and `KHMER_LINT_DEFAULT_RULES` lists the
default ones.

Options:

- `spellchecker`: anything with
  `checkWords(words) → Promise<Record<string, boolean>>`, and optionally
  `suggestWord` and `segmentWord`. The engine below fits. Without one,
  `spelling` finds nothing.
- `customWords`: an iterable of words to accept.
- `rules`.
- `maxSuggestions`: default 3. `0` skips suggestions and `unknownParts`,
  which is faster.
- `maxIssues`: default 1000.

Each issue has the following fields. Positions are 0-based, in UTF-16 code
units, per line; a line ends at `\r\n`, `\r` or `\n`.

| Field | Meaning |
| --- | --- |
| `rule` | The rule that flagged it. |
| `severity` | `warning`, or `information` for `word-separator`. |
| `message` | A human-readable description. |
| `line` | The line. |
| `start`, `end` | The span; `end` is exclusive. |
| `text` | The text the issue covers. |
| `replacements` | Fixes, best first. |
| `unknownParts` | Spelling only, for a run of several words: the parts the dictionary doesn't know, which is where the mistake is. Absent when the run doesn't split, or with `maxSuggestions: 0`. |

`applyKhmerLintFixes(text, issues)` returns `{ text, applied }`. It replaces
each issue's `text` with its first replacement and keeps the line endings. It
skips three kinds of issue:

- one with no replacements;
- one that overlaps an issue already applied;
- one whose text no longer matches.

## The spellcheck engine

```js
import { createKhmerSpellcheckEngine } from 'khmer-lint';
import affUrl from 'khmer-lint/dics/km_KH.aff?url'; // your bundler's asset-URL import
import dicUrl from 'khmer-lint/dics/km_KH.dic?url';

const engine = createKhmerSpellcheckEngine();
await engine.initialize({
  dictionaryConfig: { affUrl, dicUrl, dictionaryName: 'km_KH' },
});
await engine.checkWords(['ខ្មែរ']); // { ខ្មែរ: true }
```

`createKhmerSpellcheckEngine({ loadDictionary })` takes an optional loader,
`loadDictionary(config) → Promise<TypoDictionary | null>`. The default loader
fetches `affUrl` and `dicUrl`.

In Node, `createNodeKhmerSpellcheckEngine()` from `khmer-lint/node` reads the
two files from disk, with the paths given as `affUrl` and `dicUrl`.
`loadDictionaryFromFiles(config)` is that loader on its own.

`createKhmerInitializePayload(dicsDir, withSuggestions)` builds the
`initialize` payload for a folder that holds the three files.
`KHMER_DICTIONARY_FILES` names those files.

### `initialize(payload)`

Resolves `false` when the dictionary cannot be loaded. It loads once, and a
later call only adds what the first one lacked. The payload fields are:

| Field | Meaning |
| --- | --- |
| `dictionaryConfig` | `{ affUrl, dicUrl, dictionaryName }` |
| `dictionaryData` | A snapshot of a dictionary loaded elsewhere; see *Dictionaries in a worker* below. |
| `suggestDictionaryConfigs` | Optional. Dictionaries that suggestions are drawn from instead of the main one. `km_KH-suggest.aff` is the same word list with rules for easily confused characters. |

### Methods

| Method | Result |
| --- | --- |
| `checkWords(words)` | Each word → `true`/`false`. A word with no Khmer letter is `true`. Until a dictionary is loaded, every word is `true`. |
| `segmentWord(word)` | The run split at the dictionary words it contains, joined by U+200B. A stretch the dictionary doesn't know stays one piece. `''` when the run is itself a dictionary word, or does not split. |
| `suggestWord(word, limit = 3)` | Suggestions for a misspelled run, best first. None for a run of dictionary words. |
| `completeWord(prefix, limit = 8)` | Word completion: dictionary words that start with `prefix`, shortest first, from the same dictionaries as `suggestWord`. None for a prefix with no Khmer letter. |
| `handleMessage(request)` | The worker protocol, below. Never rejects. |

### In a web worker

```js
// spellcheck.worker.js
import { createKhmerSpellcheckEngine } from 'khmer-lint';

const engine = createKhmerSpellcheckEngine();
self.onmessage = async ({ data }) => self.postMessage(await engine.handleMessage(data));
```

Each request has the form `{ id, type, payload }`:

| `type` | `payload` |
| --- | --- |
| `initialize` | the payload above |
| `checkWords` | `{ words }` |
| `segment` | `{ word }` |
| `suggest` | `{ word, limit }` |
| `complete` | `{ prefix, limit }` |

The answer is `{ id, result }`, or `{ id, error }`. `initialize` answers
`{ ready }`.

In a worker, use absolute dictionary URLs: a relative URL resolves against the
worker script.

### Dictionaries in a worker: snapshots

| Function | Does |
| --- | --- |
| `createTypoDictionary(name, affText, dicText)` | Builds a dictionary from the files' text. |
| `createDictionarySnapshot(dictionary)` | Turns a loaded dictionary into JSON-safe data, for `postMessage`. |
| `restoreDictionaryFromSnapshot(snapshot)` | Rebuilds it. |

Pass a snapshot as `dictionaryData` to skip parsing the files a second time.

## Segmentation and separators

| Function | Does |
| --- | --- |
| `getKhmerSegmentationSegments(word, isValidWord)` | Splits an unspaced run, using your own word test. It takes the longest valid word from the left and never cuts a letter from its combining marks. Characters that match no word join the next piece, until a valid word of three or more characters starts. Returns `[]` when there are fewer than two pieces. |
| `segmentKhmerText(text, segment)` | Replaces each Khmer run with `await segment(run)`; `''` keeps the run. |
| `normalizeKhmerWordSeparators(text)` | Whitespace between Khmer letters → U+200B. |

## Text tools

| Function | Does |
| --- | --- |
| `collapseZeroWidthRuns(text)` | Each run of two or more zero-width characters → its first. |
| `removeZeroWidthCharacters(text)` | Deletes every U+200B, U+200C and U+200D. This also removes the word breaks. |
| `findZeroWidthRuns(text, max = MAX_ZERO_WIDTH_RUNS)` | `{ line, start, end }` of each run of zero-width characters, 0-based. Stops at `max`, default 5000. |
| `findKhmerWords(text)` | `{ word, line, start, end }` of each Khmer run that contains a base letter. |
| `toKhmerDigits(text, { skipNonKhmerText? })` / `toArabicDigits(text)` | `0–9` ⇄ `០–៩`. Only digits change. With `skipNonKhmerText: true`, a run of `0–9` whose nearest letter on its line, before or after, is not Khmer (`Bm7`, `Verse 1`, `Time: 4/4`, `70bpm`) is left as it is; a number with only Khmer, or no letters, around it still converts. Default `false`: every digit converts. |

## The NiDA keyboard

| Export | Does |
| --- | --- |
| `KHMER_KEY_LAYOUTS` | What each key types in each layer: `base`, `shift`, `alt` (Option on a Mac) and `altShift`. Keys are `KeyboardEvent.code` (`KeyK`, `Digit1`, `Space`); a key missing from a layer types nothing there. |
| `US_QWERTY_LAYOUT` | `code` → `[unshifted, shifted]` on US QWERTY. |
| `convertQwertyToKhmer(text)` | Text typed on US QWERTY while NiDA was meant → the Khmer it would have typed: `'xjmEr'` → `'ខ្មែរ'`. A space becomes U+200B; anything else no US key types is kept. |
| `convertKhmerToQwerty(text)` | The reverse: `'ខ្មែរ'` → `'xjmEr'`. Alt-layer characters, and characters no key types, are kept. |
| `getNidaKeystrokes(text)` | The keystrokes that type `text`, in order. See the shape below. |

Each keystroke is `{ text, code, layer, label, qwerty? }`:

- `label` is how to press it, for example `Shift+B`.
- `qwerty` is the US character on the same key; the Alt layers have none.
- When one key types several characters, it wins over typing them one by one.
  Among keys that type the same text, the one with fewer modifiers wins.
- Text that no key types comes back as `{ text, code: null }`.

## Script constants

| Export | Value |
| --- | --- |
| `ZERO_WIDTH_SPACE` | `'​'`, the word break. |
| `KHMER_BASE_LETTER_RE` | A Khmer consonant or independent vowel (U+1780–U+17B3). |
| `KHMER_WORD_RE` / `KHMER_WORD_EXACT_RE` | A run of Khmer letters and signs, global / anchored. |
| `KHMER_WORD_SEPARATOR_RE` | Whitespace between two Khmer letters; capture group 1 is the letter before it. |
| `KHMER_DIGITS` | `['០', …, '៩']` |
| `KHMER_SUGGEST_TRIGGER_CHARACTERS` | The base letters, one per entry. |
| `normalizeKhmerWord(word)` | Strips leading and trailing ZWNJ/ZWJ. |

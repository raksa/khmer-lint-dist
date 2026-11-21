/**
 * `khmer-lint` — Khmer language tools that run anywhere (browser, worker,
 * Node): the script facts, segmentation of unspaced text, the Hunspell
 * spellcheck engine, a linter, word-separator and zero-width repair, NiDA
 * keyboard conversions and Khmer digits. Node helpers that read the bundled
 * dictionaries from disk are in `khmer-lint/node`.
 */
export { KHMER_BASE_LETTER_RE, KHMER_DIGITS, KHMER_SUGGEST_TRIGGER_CHARACTERS, KHMER_WORD_EXACT_RE, KHMER_WORD_RE, KHMER_WORD_SEPARATOR_RE, normalizeKhmerWord, ZERO_WIDTH_SPACE, } from '../../../src/khmer-lint/language.js';
export { getKhmerSegmentationSegments } from '../../../src/khmer-lint/segmentation.js';
export { createKhmerSpellcheckEngine } from '../../../src/khmer-lint/spellcheck-engine.js';
export type { KhmerDictionaryLoader, KhmerSpellcheckEngine, KhmerSpellcheckEngineOptions, KhmerSpellcheckInitializePayload, KhmerSpellcheckRequest, KhmerSpellcheckResponse, } from '../../../src/khmer-lint/spellcheck-engine.js';
export { createKhmerInitializePayload, KHMER_DICTIONARY_FILES, } from '../../../src/khmer-lint/dictionary-payload.js';
export { applyKhmerLintFixes, KHMER_LINT_DEFAULT_RULES, KHMER_LINT_RULES, lintKhmerText, } from '../../../src/khmer-lint/linter.js';
export type { KhmerLintIssue, KhmerLintOptions, KhmerLintRule, KhmerLintSpellchecker, } from '../../../src/khmer-lint/linter.js';
export { findKhmerWords } from '../../../src/khmer-lint/khmer-scan.js';
export type { KhmerWordOccurrence } from '../../../src/khmer-lint/khmer-scan.js';
export { findZeroWidthRuns, MAX_ZERO_WIDTH_RUNS, } from '../../../src/khmer-lint/zero-width-scan.js';
export type { ZeroWidthRun } from '../../../src/khmer-lint/zero-width-scan.js';
export { normalizeKhmerWordSeparators, segmentKhmerText, } from '../../../src/khmer-lint/text-edits.js';
export { collapseZeroWidthRuns, removeZeroWidthCharacters, toArabicDigits, toKhmerDigits, } from '../../../src/khmer-lint/text-tools.js';
export type { ToKhmerDigitsOptions } from '../../../src/khmer-lint/text-tools.js';
export { KHMER_KEY_LAYOUTS } from '../../../src/khmer-lint/keyboard-layout.js';
export type { KhmerKeyLayer } from '../../../src/khmer-lint/keyboard-layout.js';
export { convertKhmerToQwerty, convertQwertyToKhmer, getNidaKeystrokes, US_QWERTY_LAYOUT, } from '../../../src/khmer-lint/keyboard.js';
export type { NidaKeystroke, UntypeableText, } from '../../../src/khmer-lint/keyboard.js';
export { createDictionarySnapshot, createTypoDictionary, restoreDictionaryFromSnapshot, } from '../../../src/editor/scripts/typo-dictionary.js';
export type { TypoDictionary, TypoDictionaryConfig, TypoDictionarySnapshot, } from '../../../src/editor/scripts/typo-dictionary.js';
